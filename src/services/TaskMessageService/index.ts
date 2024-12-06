import config from "../../config";
import amqp from "amqplib";
import { Mapfy } from "../../utils";

const { rabbitMQUrlDev, rabbitMQUrlProd } = config;
const rabbitMQUrl = rabbitMQUrlDev || rabbitMQUrlProd;

const TYPE = "direct";
const MAX_CHANNEL_POOL_SIZE = 5;
const CHANNEL_RETRY_DELAY = 1000; // 1 segundo
const MAX_RETRIES = 3;

export class TaskMessageService {
  connection: any = null;
  channel: any = null;
  consumers: any = {};
  connected: boolean = false;
  private channelPool: any[] = [];
  private channelCreationInProgress: boolean = false;
  lapseRetries = 1000;
  maxRetries = 10;
  currentRetry = 0;
  subscriptions: any = {};

  constructor() {
    this.connectToRabbitMQ();
  }
  async connectToRabbitMQ() {
    if (this.connection) {
      return;
    }
    try {
      this.connection = await amqp.connect(rabbitMQUrl);
      this.connection.on("close", this.handleConnectionClose);
      this.connection.on("error", this.handleConnectionError);
      this.connected = true;
      await this.initializeChannelPool();
    } catch (error) {
      this.connected = false;
      console.error(
        "[TaskMessageService] - Error connecting to RabbitMQ: ",
        error
      );
      if (this.currentRetry >= this.maxRetries) {
        return;
      }
      this.currentRetry++;
      await new Promise((resolve) => setTimeout(resolve, this.lapseRetries));
      this.connectToRabbitMQ();
    }
  }

  private handleConnectionClose = () => {
    this.connected = false;
    this.channel = null;
    this.connection = null;
    this.channelPool = [];
    this.subscriptions = {};
    console.error("[TaskMessageService] - RabbitMQ connection closed".bgRed);
  };

  private handleConnectionError = (err: any) => {
    console.error("[TaskMessageService] - RabbitMQ connection error:", err);
    this.handleConnectionClose();
  };

  private async initializeChannelPool() {
    if (this.channelCreationInProgress) return;

    this.channelCreationInProgress = true;
    try {
      for (let i = 0; i < MAX_CHANNEL_POOL_SIZE; i++) {
        const channel = await this.createChannel();
        this.channelPool.push(channel);
      }
    } catch (error) {
      console.error(
        "[TaskMessageService] - Error initializing channel pool:",
        error
      );
    } finally {
      this.channelCreationInProgress = false;
    }
  }
  private async createChannel(retries = 0): Promise<any> {
    if (!this.connection) {
      await this.connectToRabbitMQ();
    }
    try {
      const channel = await this.connection.createChannel();
      channel.on("error", (err: any) => {
        console.error("[TaskMessageService] - Channel error:", err);
        this.removeChannelFromPool(channel);
      });

      return channel;
    } catch (error) {
      if (retries < MAX_RETRIES) {
        await new Promise((resolve) =>
          setTimeout(resolve, CHANNEL_RETRY_DELAY)
        );
        return this.createChannel(retries + 1);
      }
      throw error;
    }
  }
  private getChannelFromPool(): any {
    if (this.channelPool.length > 0) {
      return this.channelPool.pop();
    }
    return this.createChannel();
  }
  private releaseChannelToPool(channel: any) {
    if (this.channelPool.length < MAX_CHANNEL_POOL_SIZE) {
      this.channelPool.push(channel);
    } else {
      channel.close();
    }
  }
  private removeChannelFromPool(channel: any) {
    this.channelPool = this.channelPool.filter((ch) => ch !== channel);
  }
  publish = async (
    payload: any,
    receiverFunc: any = undefined,
    conf: any = { type: TYPE }
  ) => {
    if (!this.connected) {
      console.warn(
        "[TaskMessageService] - RabbitMQ not connected. Skipping publish."
      );
      return;
    }
    const { type }: any = conf;
    const [exchangeName, _payload] = Mapfy(payload).entries().next().value;
    const [queueName, message] = Mapfy(_payload).entries().next().value;
    const formatedExchangeName = `${exchangeName}/type=${type}`;
    try {
      const channel = await this.getChannelFromPool();
      await channel.assertExchange(formatedExchangeName, type, {
        durable: false,
      });
      const published = channel.publish(
        formatedExchangeName,
        queueName,
        Buffer.from(JSON.stringify(message))
      );
      this.releaseChannelToPool(channel);
      return published;
    } catch (error) {
      console.error("[TaskMessageService] - Publish error:", error);
      return false;
    }
  };
  subscribe = async (payload: any, type: any = TYPE): Promise<any> => {
    const [exchangeName, _payload] = Mapfy(payload).entries().next().value;
    const [queueName, cb] = Mapfy(_payload).entries().next().value;
    const formatedExchangeName = `${exchangeName}/type=${type}`;
    try {
      const channel = await this.getChannelFromPool();
      await channel.assertExchange(formatedExchangeName, type, {
        durable: false,
      });
      if (!Mapfy(this.consumers).has(queueName)) {
        const { queue } = await channel.assertQueue(queueName, {
          exclusive: true,
        });
        await channel
          .bindQueue(queue, formatedExchangeName, queueName)
          .catch((e: any) => console.log({ e: e.message }));
        const consumerTag = await channel.consume(
          queue,
          async (message: any) => {
            if (message !== null) {
              try {
                const { content, replyTo, correlationId } = message;
                const decoded = JSON.parse(content.toString());

                let result;
                if (Array.isArray(decoded)) {
                  result = await cb(...decoded);
                } else {
                  result = await cb(decoded);
                }
                if (correlationId && replyTo) {
                  channel.sendToQueue(replyTo, Buffer.from(result.toString()), {
                    correlationId,
                  });
                }
                channel.ack(message);
              } catch (err) {
                console.error(
                  "[TaskMessageService] - Error processing message:",
                  err
                );
                channel.nack(message, false, false);
              }
            }
          }
        );
        this.consumers[queueName] = {
          consumerTag,
          channel,
        };
      }
      this.subscriptions[queueName] = true;
      return true;
    } catch (e) {
      console.error("[TaskMessageService] - Unable to subscribe:", e);
      this.subscriptions[queueName] = false;
      return false;
    }
  };
  cancelSubscription = async (queueName: string) => {
    const consumerInfo = this.consumers[queueName];
    if (consumerInfo) {
      try {
        await consumerInfo.channel.cancel(consumerInfo.consumerTag);
        delete this.consumers[queueName];
      } catch (error) {
        console.error(
          `[TaskMessageService] - Error cancelling subscription for ${queueName}:`,
          error
        );
      }
    }
  };
  isOnline = () => this.connected && this.channelPool.length > 0;
  close = async () => {
    for (const channel of this.channelPool) {
      await channel.close();
    }
    if (this.connection) {
      await this.connection.close();
    }
    this.connected = false;
    this.channelPool = [];
  };
  reconnect = async () => {
    await this.close();
    this.maxRetries = 3;
    this.lapseRetries = 200;
    this.currentRetry = 0;
    await this.connectToRabbitMQ();
  };
}
