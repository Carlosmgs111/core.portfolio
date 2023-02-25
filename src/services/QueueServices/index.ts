import Queue from "bull";
import config from "../../config";
import amqp from "amqplib";

const { redisUrlProd, redisUrlDev } = config;
const redisUrlConnection = redisUrlDev || redisUrlProd;
console.log(!redisUrlDev ? "PRODUCTION".bgGreen : "DEVELOPMENT".bgYellow);

export const createQueueService = () => new QueueService();
export class QueueService {
  connection: any;
  constructor() {
    this.setup();
  }

  setup = async () => {
    try {
      this.connection = await amqp.connect("amqp://localhost");
    } catch (error) {
      console.log("Error al establecer la conexión", error);
    }
  };

  createQueue = async (queueName: any) => {
    try {
      const channel = await this.connection.createChannel();
      await channel.assertQueue(queueName);
    } catch (error) {
      console.log("Error al crear la cola", error);
    }
    return this;
  };

  sendMessage = async (queueName: any, message: any) => {
    const channel = await this.connection.createChannel();
    try {
      await channel.sendToQueue(
        queueName,
        Buffer.from(JSON.stringify(message))
      );
    } catch (error) {
      console.log("Error al enviar el mensaje", error);
    }
    return this;
  };

  receiveMessage = async (queueName: any, cb: any) => {
    const channel = await this.connection.createChannel();
    try {
      await channel.assertQueue(queueName, { durable: true });
      channel.consume(queueName, (message: any) => {
        if (message !== null) {
          if (Array.isArray(JSON.parse(message.content.toString())))
            cb(...JSON.parse(message.content.toString()));
          else cb(JSON.parse(message.content.toString()));
          channel.ack(message);
        }
      });
    } catch (error) {
      console.error(`Error occurred while receiving message: ${error}`);
    }
  };
}
