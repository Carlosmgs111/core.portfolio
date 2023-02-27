import Queue from "bull";
import config from "../../config";
import amqp from "amqplib";
import { changeUsername } from "../../modules/users/use_cases";

const { redisUrlProd, redisUrlDev } = config;
const redisUrlConnection = redisUrlDev || redisUrlProd;
console.log(!redisUrlDev ? "PRODUCTION".bgGreen : "DEVELOPMENT".bgYellow);

export const createQueueService = () => new QueueService();
export class QueueService {
  connection: any;
  channel: any;
  constructor() {
    this.setup();
  }

  setup = () => {
    amqp
      .connect("amqp://localhost")
      .then((connection: any) => {
        this.connection = connection;
        connection
          .createChannel()
          .then((channel: any) => (this.channel = channel))
          .catch((error: any) => console.log(error.message.red));
        process.on("SIGINT", () => connection.close());
      })
      .catch((error: any) => console.log(error.message.bgRed));
  };

  createExchange = (exchangeName: any) => {
    this.channel.assertExchange(exchangeName, "fanout", {
      durable: false,
      exclusive: false,
    });
    return this;
  };

  sendMessage = (exchangeName: any, message: any) => {
    this.channel
      .assertExchange(exchangeName, "fanout", {
        durable: false,
        exclusive: false,
      })
      .catch((e: any) => console.log(e));
    this.channel.publish(
      exchangeName,
      `${exchangeName}_1`,
      Buffer.from(JSON.stringify(message))
    );
    return this;
  };

  receiveMessage = (exchangeName: any, cb: any) => {
    this.channel
      .assertQueue(`${exchangeName}_1`, { exclusive: false, durable: true })
      .then((q: any) => {
        const { queue } = q;
        if (exchangeName === "queryServiceCreateMany") console.log({ queue });
        this.channel.bindQueue(queue, exchangeName, exchangeName);
        this.channel.consume(queue, (message: any) => {
          const decoded = JSON.parse(message.content.toString());
          if (message !== null) {
            if (Array.isArray(decoded))
              cb(...decoded).catch((e: any) => {
                console.log(e.message.bgRed);
              });
            else
              cb(decoded).catch((e: any) => {
                console.log(e.message.bgRed);
              });

            this.channel.ack(message);
          }
        });
      })
      .catch((error: any) => console.log(error.message));

    return this;
  };
}
