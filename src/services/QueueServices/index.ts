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
  constructor() {
    this.setup();
  }

  setup = () =>
    amqp
      .connect("amqp://localhost")
      .then((connection: any) => (this.connection = connection))
      .catch((error: any) => console.log(error.message.bgRed));

  createQueue = (queueName: any) => {
    this.connection.createChannel().then((channel: any) => {
      channel.assertQueue(queueName);
    });
    return this;
  };

  sendMessage = (queueName: any, message: any) => {
    this.connection
      .createChannel()
      .then((channel: any) =>
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
      );

    return this;
  };

  receiveMessage = (queueName: any, cb: any) => {
    this.connection.createChannel().then((channel: any) => {
      channel.assertQueue(queueName, { durable: true });
      channel
        .consume(queueName, (message: any) => {
          if (message !== null) {
            if (Array.isArray(JSON.parse(message.content.toString())))
              cb(...JSON.parse(message.content.toString())).catch((e: any) => {
                console.log(e.message.bgRed);
              });
            else
              cb(JSON.parse(message.content.toString())).catch((e: any) => {
                console.log(e.message.bgRed);
              });

            channel.ack(message);
          }
        })
        .catch((error: any) => console.log(error.message.red));
    });
    return this;
  };
}
