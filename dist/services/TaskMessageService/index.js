"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMessageService = void 0;
const config_1 = __importDefault(require("../../config"));
const amqplib_1 = __importDefault(require("amqplib"));
const { rabbitMQUrlDev, rabbitMQUrlProd } = config_1.default;
const rabbitMQUrl = rabbitMQUrlDev || rabbitMQUrlProd;
console.log(!rabbitMQUrl ? "PRODUCTION".bgGreen : "DEVELOPMENT".bgYellow);
class TaskMessageService {
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
                    .catch((error) => console.log(error.message.red));
                // process.on("SIGINT", () => connection.close());
            })
                .catch((error) => console.log(error.message.bgRed));
        };
        this.createExchange = (exchangeName, type = "fanout") => {
            if (this.channel) {
                this.channel.assertExchange(exchangeName, type, {
                    durable: false,
                    exclusive: false,
                });
            }
            else {
                setTimeout(() => this.createExchange(exchangeName), 2000);
            }
            return this;
        };
        this.sendMessage = (exchangeName, message, type = "fanout") => {
            if (this.channel) {
                this.channel
                    .assertExchange(exchangeName, type, {
                    durable: false,
                    exclusive: false,
                })
                    .catch((e) => console.log(e));
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
                    this.channel.bindQueue(queue, exchangeName, exchangeName);
                    this.channel.consume(queue, (message) => {
                        var _a, _b, _c, _d;
                        const decoded = JSON.parse(message.content.toString());
                        if (message !== null) {
                            if (Array.isArray(decoded))
                                (_b = (_a = cb(...decoded)) === null || _a === void 0 ? void 0 : _a.then((message) => console.log(`Received ${message.slice(0, 100)}...`.bgBlue))) === null || _b === void 0 ? void 0 : _b.catch((e) => {
                                    console.log(e.message.bgRed);
                                });
                            else
                                (_d = (_c = cb(decoded)) === null || _c === void 0 ? void 0 : _c.then((message) => console.log(`Received ${message.slice(0, 100)}...`.bgBlue))) === null || _d === void 0 ? void 0 : _d.catch((e) => {
                                    console.log(e.message.bgRed);
                                });
                            this.channel.ack(message);
                        }
                    });
                })
                    .catch((error) => console.log(error.message));
            }
            else {
                setTimeout(() => this.receiveMessage(exchangeName, cb), 1000);
            }
            return this;
        };
        this.setup();
    }
}
exports.TaskMessageService = TaskMessageService;
