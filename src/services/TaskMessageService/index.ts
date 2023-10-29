import config from "../../config";
import amqp from "amqplib";
import { Mapfy } from "../../utils";

const { rabbitMQUrlDev, rabbitMQUrlProd } = config;
const rabbitMQUrl = rabbitMQUrlDev || rabbitMQUrlProd;

console.log(
  !rabbitMQUrlDev ? "MQ PRODUCTION".bgGreen : "MQ DEVELOPMENT".bgYellow
);

export class TaskMessageService {
  connection: any = null;
  channel: any = null;
  consumers: any = {};

  constructor() {
    this.setup();
  }

  setup = () => {
    amqp
      .connect(rabbitMQUrl)
      .then((connection: any) => {
        this.connection = connection;
        connection
          .createChannel()
          .then((channel: any) => {
            this.channel = channel;
          })
          .catch((error: any) => {
            console.log({ ["Error message in setup"]: error.message.red });
          });
        process.on("SIGINT", () => connection.close());
      })
      .catch((error: any) => {
        console.log(error.message.bgRed);
      });
  };

  getChannel = () =>
    new Promise((resolve: any, reject: any) => {
      if (!this.channel) {
        const delayedProcess = setTimeout(() => {
          if (this.channel) {
            resolve(this.channel);
            clearTimeout(delayedProcess);
          }
          if (!this.channel) {
            this.connection
              .createChannel()
              .then((channel: any) => {
                this.channel = channel;
                resolve([this.connection, channel]);
              })
              .catch((error: any) => {
                console.log({ ["Error message in setup"]: error.message.red });
                reject(error);
              });
            process.on("SIGINT", () => this.connection.close());
          }
        }, 5000);
      } else {
        resolve(this.channel);
      }
    }).then((data) => data);

  createExchange = (exchangeName: any, type: any = "fanout") => {
    this.getChannel().then((_channel: any) => {
      _channel
        .assertExchange(exchangeName, type, {
          durable: false,
          exclusive: false,
        })
        .catch((e: any) => {
          console.log({ ["Error message in createExchange"]: e.message.red });
        });
    });

    return this;
  };

  sendMessage = (
    payload: any,
    receiverFunc: any = undefined,
    conf: any = { type: "fanout" }
  ) => {
    const { type }: any = conf;
    const [exchangeName, _payload] = Mapfy(payload).entries().next().value;
    const [functionName, message] = Mapfy(_payload).entries().next().value;

    this.getChannel().then((_channel: any) => {
      _channel
        .assertExchange(exchangeName, type, {
          durable: false,
          exclusive: false,
        })
        .catch((e: any) => {
          console.log({ ["Error message in sendMessage"]: e.message.red });
        });
      _channel.publish(
        exchangeName,
        `${functionName}_1`,
        Buffer.from(JSON.stringify(message))
      );
    });

    if (receiverFunc) return this.receiveMessage(receiverFunc);
    return this;
  };

  receiveMessage = (payload: any): any => {
    let [exchangeName, cb]: ["", Function] = ["", (...[]) => {}];

    if (payload instanceof Function) {
      [exchangeName, cb] = [payload.name, payload];
    } else if (payload instanceof Object) {
      [exchangeName, cb] = Mapfy(payload).entries().next().value;
    }

    const queueName = `${exchangeName}_1`;

    if (!Mapfy(this.consumers).has(queueName)) {
      this.consumers[queueName] = (resolve: any, reject: any) => {
        this.getChannel().then((_channel: any) => {
          _channel
            .assertQueue(queueName, {
              exclusive: false,
              durable: true,
            })
            .then(async (q: any) => {
              const { queue } = q;
              _channel.bindQueue(queue, exchangeName, exchangeName);
              let callback = (message: any) => {
                // console.log({ message });

                if (message instanceof Function) {
                  console.log("Message Function: ".green, message());
                  return;
                }

                const decoded = JSON.parse(message.content.toString());
                try {
                  if (message !== null) {
                    if (Array.isArray(decoded))
                      cb(...decoded)
                        .then((_message: any) => {
                          console.log({ _message });
                          resolve(_message);
                          return _message;
                        })
                        .catch((e: any) => {
                          console.log(e.message.red);
                          reject(e);
                          return;
                        });
                    else
                      cb(decoded)
                        .then((_message: any) => {
                          resolve(_message);
                          return _message;
                        })
                        .catch((e: any) => {
                          reject(e);
                        });
                    _channel.ack(message);
                    // ? The channel shouldn't be closed, but when it is closed avoid abnormal behavior in promise
                    // ? resolution, in this case with generate image service
                  }
                } catch (e: any) {
                  console.log(e.message.red);
                  reject(e.message);
                } finally {
                  return;
                }
              };
              _channel.consume(queue, callback).catch((e: any) => {
                console.log(e.message.red);
                reject(e.message);
              });
            })
            .catch((error: any) => reject(error.message));
        });
      };
    }
    
    return new Promise((resolve: any, reject: any) => {
      this.consumers[queueName](resolve, reject);
    })
      .then((data: any) => {
        console.log({ data });
        return data;
      })
      .catch((e: any) => {
        console.log(
          "Error in catch callback of Promise returned from receiveMessage: "
            .bgYellow,
          e.message.bgRed
        );
      });
  };

  close = async () => {
    await this.channel.close();
    await this.connection.close();
  };
}
