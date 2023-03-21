"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = exports.createQueueService = void 0;
const config_1 = __importDefault(require("../../config"));
const amqplib_1 = __importDefault(require("amqplib"));
const { rabbitMQUrlDev, rabbitMQUrlProd } = config_1.default;
const rabbitMQUrl = rabbitMQUrlDev || rabbitMQUrlProd;
(!rabbitMQUrl ? "PRODUCTION".bgGreen : "DEVELOPMENT".bgYellow);
const createQueueService = () => new QueueService();
exports.createQueueService = createQueueService;
class QueueService {
    constructor() {
        this.setup = () => {
            (connection, channel) => {
                this.connection = connection;
                this.channel = channel;
            };
            amqplib_1.default
                .connect(rabbitMQUrl)
                .then((connection) => {
                this.connection = connection;
                connection
                    .createChannel()
                    .then((channel) => (this.channel = channel))
                    .catch((error) => (error.message.red));
                process.on("SIGINT", () => connection.close());
            })
                .catch((error) => (error.message.bgRed));
        };
        this.createExchange = (exchangeName) => {
            if (this.channel) {
                this.channel.assertExchange(exchangeName, "fanout", {
                    durable: false,
                    exclusive: false,
                });
            }
            else {
                setTimeout(() => this.createExchange(exchangeName), 2000);
            }
            return this;
        };
        this.sendMessage = (exchangeName, message) => {
            if (this.channel) {
                this.channel
                    .assertExchange(exchangeName, "fanout", {
                    durable: false,
                    exclusive: false,
                })
                    .catch((e) => (e));
                this.channel.publish(exchangeName, `${exchangeName}_1`, Buffer.from(JSON.stringify(message)));
            }
            else {
                setTimeout(() => this.sendMessage(exchangeName, message), 2000);
            }
            return this;
        };
        this.receiveMessage = (exchangeName, cb) => {
            if (this.channel) {
                this.channel
                    .assertQueue(`${exchangeName}_1`, { exclusive: false, durable: true })
                    .then((q) => {
                    const { queue } = q;
                    if (exchangeName === "queryServiceCreateMany")
                        ({ queue });
                    this.channel.bindQueue(queue, exchangeName, exchangeName);
                    this.channel.consume(queue, (message) => {
                        const decoded = JSON.parse(message.content.toString());
                        if (message !== null) {
                            if (Array.isArray(decoded))
                                cb(...decoded).catch((e) => {
                                    (e.message.bgRed);
                                });
                            else
                                cb(decoded).catch((e) => {
                                    (e.message.bgRed);
                                });
                            this.channel.ack(message);
                        }
                    });
                })
                    .catch((error) => (error.message));
            }
            else {
                setTimeout(() => this.receiveMessage(exchangeName, cb), 1000);
            }
            return this;
        };
        this.setup();
    }
}
exports.QueueService = QueueService;
