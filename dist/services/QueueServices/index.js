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
        this.setup = () => amqplib_1.default
            .connect("amqp://localhost")
            .then((connection) => (this.connection = connection))
            .catch((error) => console.log(error.message.bgRed));
        this.createQueue = (queueName) => {
            this.connection.createChannel().then((channel) => {
                channel.assertQueue(queueName);
            });
            return this;
        };
        this.sendMessage = (queueName, message) => {
            this.connection
                .createChannel()
                .then((channel) => channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message))));
            return this;
        };
        this.receiveMessage = (queueName, cb) => {
            this.connection.createChannel().then((channel) => {
                channel.assertQueue(queueName, { durable: true });
                channel
                    .consume(queueName, (message) => {
                    if (message !== null) {
                        if (Array.isArray(JSON.parse(message.content.toString())))
                            cb(...JSON.parse(message.content.toString())).catch((e) => {
                                console.log(e.message.bgRed);
                            });
                        else
                            cb(JSON.parse(message.content.toString())).catch((e) => {
                                console.log(e.message.bgRed);
                            });
                        channel.ack(message);
                    }
                })
                    .catch((error) => console.log(error.message.red));
            });
            return this;
        };
        this.setup();
    }
}
exports.QueueService = QueueService;
