import config from "../../config";
import amqp from "amqplib";
import { Mapfy } from "../../utils";

const { rabbitMQUrlDev, rabbitMQUrlProd } = config;
const rabbitMQUrl = rabbitMQUrlDev || rabbitMQUrlProd;

console.log(
  !rabbitMQUrlDev ? "MQ PRODUCTION".bgGreen : "MQ DEVELOPMENT".bgYellow
);

export class TaskMessageService {
  connection: any;
  channel: any;

  constructor() {
    this.setup();
  }

  setup = () => {
    (connection: any, channel: any) => {
      this.connection = connection;
      this.channel = channel;
    };
    amqp
      .connect(rabbitMQUrl)
      .then((connection: any) => {
        this.connection = connection;
        connection
          .createChannel()
          .then((channel: any) => (this.channel = channel))
          .catch((error: any) => error.message.red);
        // process.on("SIGINT", () => connection.close());
      })
      .catch((error: any) => error.message.bgRed);
  };

  createExchange = (exchangeName: any, type: any = "fanout") => {
    if (this.channel) {
      this.channel.assertExchange(exchangeName, type, {
        durable: false,
        exclusive: false,
      });
    } else {
      setTimeout(() => this.createExchange(exchangeName), 1000);
    }
    return this;
  };

  sendMessage = (
    payload: any,
    receiverFunc: any = undefined,
    type: any = "fanout"
  ) => {
    const [exchangeName, _payload] = Mapfy(payload).entries().next().value;
    const [functionName, message] = Mapfy(_payload).entries().next().value;
    // if (receiverFunc) this.receiveMessage({ receiverFunc });
    console.log({ exchangeName, functionName, message });
    this.channel
      .assertExchange(exchangeName, type, {
        durable: false,
        exclusive: false,
      })
      .catch((e: any) => e);
    this.channel.publish(
      exchangeName,
      `${functionName}_1`,
      Buffer.from(JSON.stringify(message))
    );

    return this;
  };

  receiveMessage = (payload: any): any => {
    const [exchangeName, cb] = Mapfy(payload).entries().next().value;

    return new Promise((resolve: any, reject: any) => {
      const process = () => {
        const channel = this.channel;
        this.channel
          .assertQueue(`${exchangeName}_1`, {
            exclusive: false,
            durable: true,
          })
          .then(async (q: any) => {
            const { queue } = q;
            this.channel.bindQueue(queue, exchangeName, exchangeName);
            const { consumerTag } = await this.channel.consume(
              queue,
              (message: any) => {
                const decoded = JSON.parse(message.content.toString());
                if (message !== null) {
                  if (Array.isArray(decoded))
                    cb(...decoded)
                      .then((_message: any) => {
                        resolve(_message);
                        return _message;
                      })
                      .catch((e: any) => {
                        reject(e);
                      });
                  else
                    cb(decoded)
                      .then((message: any) => {
                        resolve(message);
                        return message;
                      })
                      .catch((e: any) => {
                        reject(e);
                      });

                  channel.ack(message);
                  // ? this is very important, once a message is received, the channel must be 
                  // ? closed to avoid abnormal behavior in promise resolution
                  channel.cancel(consumerTag);
                }
              }
            );
          })
          .catch((error: any) => {
            reject(error.message);
          });
      };
      if (!this.channel) setTimeout(process, 5000);
      else process();
    })
      .then((data: any) => data)
      .catch((e: any) => console.log(e.message.bgRed))
      .finally(() => console.log("Finished!".bgGreen));
  };
}
