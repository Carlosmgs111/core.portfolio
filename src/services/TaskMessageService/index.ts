import config from "../../config";
import amqp from "amqplib";
import { Mapfy } from "../../utils";

const { rabbitMQUrlDev, rabbitMQUrlProd } = config;
const rabbitMQUrl = rabbitMQUrlDev || rabbitMQUrlProd;

console.log(
  !rabbitMQUrlDev ? "MQ PRODUCTION".bgGreen : "MQ DEVELOPMENT".bgYellow
);

const TYPE = "direct";

export class TaskMessageService {
  connection: any = null;
  channel: any = null;
  consumers: any = {};

  constructor() {}

  getConnection = () =>
    new Promise((resolve, reject) => {
      if (this.connection) {
        resolve(this.connection);
      } else {
        amqp
          .connect(rabbitMQUrl)
          .then((connection) => {
            this.connection = connection;
            resolve(connection);
          })
          .catch((error) => {
            console.error("Error al conectar a RabbitMQ:", error);
            reject(error);
          });
      }
    });

  getChannel = () =>
    new Promise((resolve: any, reject: any) => {
      if (this.channel) {
        resolve(this.channel);
      } else {
        this.getConnection()
          .then((_connection: any) => {
            _connection
              .createChannel()
              .then((channel: any) => {
                this.channel = channel;
                resolve(channel);
              })
              .catch((error: any) => {
                console.error("Error en setup:", error);
                reject(error);
              });
          })
          .catch((e) => console.log({ e }));
      }
    }).then((data) => data);

  createExchange = (exchangeName: any, type: any = TYPE) => {
    const formatedExchangeName = `${exchangeName}/type=${type}`;
    return new Promise((resolve, reject) => {
      this.getChannel()
        .then((_channel: any) => {
          _channel
            .assertExchange(formatedExchangeName, type, {
              durable: false,
              // exclusive: false,
            })
            .then(({ exchange }: any) => {
              resolve(exchange);
            })
            .catch((e: any) => {
              console.log({ "Error message in createExchange": e.message.red });
            });
        })
        .catch((e) => console.log(e));
    });
  };

  sendMessage = async (
    payload: any,
    receiverFunc: any = undefined,
    conf: any = { type: TYPE }
  ) => {
    const { type }: any = conf;
    const [exchangeName, _payload] = Mapfy(payload).entries().next().value;
    const [functionName, message] = Mapfy(_payload).entries().next().value;
    const formatedExchangeName = `${exchangeName}/type=${type}`;
    const queueName = `${formatedExchangeName}_1`;

    this.createExchange(exchangeName).then(() => {
      this.getChannel()
        .then((_channel: any) => {
          _channel
            .assertExchange(formatedExchangeName, type, {
              durable: false,
              // exclusive: true,
            })
            .finally(() => {
              _channel.publish(
                formatedExchangeName,
                queueName,
                Buffer.from(JSON.stringify(message))
              );
            })
            .catch((e: any) => {
              console.log({ "Error message in sendMessage": e.message.red });
            });
        })
        .catch((e: any) => console.log(e.message));
    });
    console.log("SENDING!");
    if (receiverFunc) {
      return this.receiveMessage(receiverFunc);
    }
    return this;
  };

  receiveMessage = (payload: any, type: any = TYPE): any => {
    let [exchangeName, cb]: ["", Function] = ["", (...[]) => {}];
    if (payload instanceof Function) {
      [exchangeName, cb] = [payload.name, payload];
    } else if (payload instanceof Object) {
      [exchangeName, cb] = Mapfy(payload).entries().next().value;
    }
    const formatedExchangeName = `${exchangeName}/type=${type}`;
    const queueName = `${formatedExchangeName}_1`;

    if (!Mapfy(this.consumers).has(queueName)) {
      this.getChannel().then((_channel: any) => {
        _channel
          .assertQueue(queueName, {
            exclusive: true,
          })
          .then(({ queue }: any) => {
            console.log({ queue });
            _channel
              .bindQueue(queue, formatedExchangeName, queueName)
              .catch((e: any) => console.log({ e: e.message }));
            _channel
              .consume(queue, (message: any) => {
                const decoded = JSON.parse(message.content.toString());
                try {
                  if (message !== null) {
                    if (Array.isArray(decoded)) cb(...decoded);
                    else cb(decoded);
                    _channel.ack(message);
                  }
                } catch (e: any) {
                } finally {
                  return;
                }
              })
              .then(({ consumerTag }: any) => {
                this.consumers[queueName] = consumerTag;
                // console.log({ consumerTag });
                console.log(this.consumers);
              })
              .catch((e: any) => {});
          });
      });
    }
  };

  close = async () => {
    await this.channel.close();
    await this.connection.close();
  };
}
