import config from "../../config";
import amqp from "amqplib";

const { rabbitMQUrlDev, rabbitMQUrlProd } = config;
const rabbitMQUrl = rabbitMQUrlDev || rabbitMQUrlProd;
console.log(!rabbitMQUrl ? "PRODUCTION".bgGreen : "DEVELOPMENT".bgYellow);

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
          .catch((error: any) => console.log(error.message.red));
        // process.on("SIGINT", () => connection.close());
      })
      .catch((error: any) => console.log(error.message.bgRed));
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

  sendMessage = (exchangeName: any, message: any, type: any = "fanout") => {
    if (this.channel) {
      this.channel
        .assertExchange(exchangeName, type, {
          durable: false,
          exclusive: false,
        })
        .catch((e: any) => console.log(e));
      this.channel.publish(
        exchangeName,
        `${exchangeName}_1`,
        Buffer.from(JSON.stringify(message))
      );
    } else {
      setTimeout(() => this.sendMessage(exchangeName, message), 1000);
    }
    return this;
  };

  receiveMessage = (exchangeName: any, cb: any) => {
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
                  ?.then((message: any) =>
                    console.log(`Received ${message?.slice(0, 100)}...`.bgBlue)
                  )
                  ?.catch((e: any) => {
                    console.log(e.message.bgRed);
                  });
              else
                cb(decoded)
                  ?.then((message: any) =>
                    console.log(`Received ${message?.slice(0, 100)}...`.bgBlue)
                  )
                  ?.catch((e: any) => {
                    console.log(e.message.bgRed);
                  });

              this.channel.ack(message);
            }
          });
        })
        .catch((error: any) => console.log(error.message));
    } else {
      setTimeout(() => this.receiveMessage(exchangeName, cb), 1000);
    }
    return this;
  };
}
