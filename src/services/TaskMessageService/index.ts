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
    if (this.channel) {
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
    } else {
      setTimeout(() => this.sendMessage(payload, receiverFunc), 1000);
    }
    return this;
  };

  receiveMessage = (payload: any) => {
    const [exchangeName, cb] = Mapfy(payload).entries().next().value;
    console.log({ exchangeName, cb });
    if (this.channel) {
      this.channel
        .assertQueue(`${exchangeName}_1`, { exclusive: false, durable: true })
        .then((q: any) => {
          const { queue } = q;
          this.channel.bindQueue(queue, exchangeName, exchangeName);
          this.channel.consume(queue, (message: any) => {
            const decoded = JSON.parse(message.content.toString());
            if (message !== null) {
              if (Array.isArray(decoded))
                cb(...decoded)
                  ?.then((message: any) => {
                    console.log({ message });
                    console.log(`Received ${message?.slice(0, 100)}...`.bgBlue);
                  })
                  ?.catch((e: any) => {
                    e.message.bgRed;
                  });
              else
                cb(decoded)
                  ?.then((message: any) => {
                    console.log({ message });
                    console.log(`Received ${message?.slice(0, 100)}...`.blue);
                  })
                  ?.catch((e: any) => {
                    e.message.bgRed;
                  });

              this.channel.ack(message);
            }
          });
        })
        .catch((error: any) => error.message);
    } else {
      setTimeout(() => this.receiveMessage(payload), 1000);
    }
    return this;
  };
}
