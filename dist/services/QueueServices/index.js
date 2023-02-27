"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueService = exports.createQueueService = void 0;
const config_1 = __importDefault(require("../../config"));
const amqplib_1 = __importDefault(require("amqplib"));
const { redisUrlProd, redisUrlDev } = config_1.default;
const redisUrlConnection = redisUrlDev || redisUrlProd;
console.log(!redisUrlDev ? "PRODUCTION".bgGreen : "DEVELOPMENT".bgYellow);
const createQueueService = () => new QueueService();
exports.createQueueService = createQueueService;
class QueueService {
    constructor() {
        this.setup = () => {
            amqplib_1.default
                .connect("amqp://localhost")
                .then((connection) => {
                this.connection = connection;
                connection
                    .createChannel()
                    .then((channel) => (this.channel = channel))
                    .catch((error) => console.log(error.message.red));
                process.on("SIGINT", () => connection.close());
            })
                .catch((error) => console.log(error.message.bgRed));
        };
        this.createExchange = (exchangeName) => {
            this.channel.assertExchange(exchangeName, "fanout", {
                durable: false,
                exclusive: false,
            });
            return this;
        };
        this.sendMessage = (exchangeName, message) => {
            this.channel
                .assertExchange(exchangeName, "fanout", {
                durable: false,
                exclusive: false,
            })
                .catch((e) => console.log(e));
            this.channel.publish(exchangeName, `${exchangeName}_1`, Buffer.from(JSON.stringify(message)));
            return this;
        };
        this.receiveMessage = (exchangeName, cb) => {
            this.channel
                .assertQueue(`${exchangeName}_1`, { exclusive: false, durable: true })
                .then((q) => {
                const { queue } = q;
                if (exchangeName === "queryServiceCreateMany")
                    console.log({ queue });
                this.channel.bindQueue(queue, exchangeName, exchangeName);
                this.channel.consume(queue, (message) => {
                    const decoded = JSON.parse(message.content.toString());
                    if (message !== null) {
                        if (Array.isArray(decoded))
                            cb(...decoded).catch((e) => {
                                console.log(e.message.bgRed);
                            });
                        else
                            cb(decoded).catch((e) => {
                                console.log(e.message.bgRed);
                            });
                        this.channel.ack(message);
                    }
                });
            })
                .catch((error) => console.log(error.message));
            return this;
        };
        this.setup();
    }
}
exports.QueueService = QueueService;
