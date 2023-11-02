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

  constructor() {
    (async () => {
      this.connection = await this.connectToRabbitMQ();
    })();
  }

  async connectToRabbitMQ() {
    if (this.connection) {
      return this.connection;
    }

    try {
      this.connection = await amqp.connect(rabbitMQUrl);
      this.connection.on("close", () => {
        this.connection = null;
      });
      return this.connection;
    } catch (error) {
      console.error("Error al conectar a RabbitMQ:", error);
      throw error;
    }
  }

  getChannel = async () => {
    if (this.channel) {
      return this.channel;
    } else {
      const connection = await this.connectToRabbitMQ();
      try {
        return await connection.createChannel();
      } catch (e: any) {
        console.log(e.message.red);
      }
    }
  };

  assertExchange = async (exchangeName: any, type: any = TYPE) => {
    const formatedExchangeName = `${exchangeName}/type=${type}`;
    const _channel = await this.getChannel();

    const { exchange } = await _channel.assertExchange(
      formatedExchangeName,
      type,
      {
        durable: false,
        // exclusive: false,
      }
    );
    return exchange;
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
    try {
      await this.assertExchange(exchangeName);
      const _channel = await this.getChannel();
      await _channel.assertExchange(formatedExchangeName, type, {
        durable: false,
        // exclusive: true,
      });
      await _channel.publish(
        formatedExchangeName,
        queueName,
        Buffer.from(JSON.stringify(message))
      );
    } catch (e: any) {
      console.log(e.message.gbRed);
    }

    if (receiverFunc) {
      await this.receiveMessage(receiverFunc);
    }
    return this;
  };

  receiveMessage = async (payload: any, type: any = TYPE): Promise<any> => {
    let [exchangeName, cb]: ["", Function] = ["", (...[]) => {}];
    if (payload instanceof Function) {
      [exchangeName, cb] = [payload.name, payload];
    } else if (payload instanceof Object) {
      [exchangeName, cb] = Mapfy(payload).entries().next().value;
    }
    const formatedExchangeName = `${exchangeName}/type=${type}`;
    const queueName = `${formatedExchangeName}_1`;

    if (!Mapfy(this.consumers).has(queueName)) {
      await this.assertExchange(exchangeName);
      const _channel = await this.getChannel();
      const { queue } = await _channel.assertQueue(queueName, {
        exclusive: true,
      });
      await _channel
        .bindQueue(queue, formatedExchangeName, queueName)
        .catch((e: any) => console.log({ e: e.message }));

      const consumerTag = await _channel.consume(queue, (message: any) => {
        if (message !== null) {
          const decoded = JSON.parse(message.content.toString());
          if (Array.isArray(decoded))
            cb(...decoded)
              .then((_result: any) => {
                console.log({ _result });
              })
              .catch((err: any) => console.log({ err }));
          else
            cb(decoded).then((_result: any) => {
              console.log({ _result });
            });
          _channel.ack(message);
        }
      });
      this.consumers[queueName] = consumerTag;
    }
  };

  addEvent = (cb: any) => {};

  close = async () => {
    await this.channel.close();
    await this.connection.close();
  };
}
