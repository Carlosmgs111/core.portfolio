"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMessageService = void 0;
const config_1 = __importDefault(require("../../config"));
const amqplib_1 = __importDefault(require("amqplib"));
const utils_1 = require("../../utils");
const { rabbitMQUrlDev, rabbitMQUrlProd } = config_1.default;
const rabbitMQUrl = rabbitMQUrlDev || rabbitMQUrlProd;
console.log(!rabbitMQUrlDev ? "MQ PRODUCTION".bgGreen : "MQ DEVELOPMENT".bgYellow);
class TaskMessageService {
    constructor() {
        this.setup = () => {
            amqplib_1.default
                .connect(rabbitMQUrl)
                .then((connection) => {
                this.connection = connection;
                connection
                    .createChannel()
                    .then((channel) => (this.channel = channel))
                    .catch((error) => {
                    console.log({ ["Error message in setup"]: error.message.red });
                });
                process.on("SIGINT", () => connection.close());
            })
                .catch((error) => {
                console.log(error.message.bgRed);
            });
        };
        this.createExchange = (exchangeName, type = "fanout") => {
            if (this.channel) {
                this.channel
                    .assertExchange(exchangeName, type, {
                    durable: false,
                    exclusive: false,
                })
                    .catch((e) => {
                    console.log({ ["Error message in createExchange"]: e.message.red });
                });
            }
            else {
                setTimeout(() => this.createExchange(exchangeName), 1000);
            }
            return this;
        };
        this.sendMessage = (payload, receiverFunc = undefined, conf = { type: "fanout" }) => {
            const { type } = conf;
            const [exchangeName, _payload] = (0, utils_1.Mapfy)(payload).entries().next().value;
            const [functionName, message] = (0, utils_1.Mapfy)(_payload).entries().next().value;
            this.channel
                .assertExchange(exchangeName, type, {
                durable: false,
                exclusive: false,
            })
                .catch((e) => {
                console.log({ ["Error message in sendMessage"]: e.message.red });
            });
            this.channel.publish(exchangeName, `${functionName}_1`, Buffer.from(JSON.stringify(message)));
            if (receiverFunc)
                return this.receiveMessage(receiverFunc);
            return this;
        };
        this.receiveMessage = (payload) => {
            let [exchangeName, cb] = ["", (...[]) => { }];
            if (payload instanceof Function) {
                [exchangeName, cb] = [payload.name, payload];
            }
            else if (payload instanceof Object) {
                [exchangeName, cb] = (0, utils_1.Mapfy)(payload).entries().next().value;
            }
            return new Promise((resolve, reject) => {
                const process = () => {
                    const channel = this.channel;
                    this.channel
                        .assertQueue(`${exchangeName}_1`, {
                        exclusive: false,
                        durable: true,
                    })
                        .then((q) => __awaiter(this, void 0, void 0, function* () {
                        const { queue } = q;
                        this.channel.bindQueue(queue, exchangeName, exchangeName);
                        const { consumerTag } = yield this.channel
                            .consume(queue, (message) => {
                            const decoded = JSON.parse(message.content.toString());
                            try {
                                if (message !== null) {
                                    if (Array.isArray(decoded))
                                        cb(...decoded)
                                            .then((_message) => {
                                            // console.log({ _message });
                                            resolve(_message);
                                            return _message;
                                        })
                                            .catch((e) => {
                                            console.log(e.message.red);
                                            reject(e);
                                            return;
                                        });
                                    else
                                        cb(decoded)
                                            .then((_message) => {
                                            resolve(_message);
                                            return _message;
                                        })
                                            .catch((e) => {
                                            reject(e);
                                        });
                                    // channel.ack(message);
                                    // ? The channel shouldn't be closed, but when it is closed avoid abnormal behavior in promise 
                                    // ? resolution, in this case with generate image service
                                    // channel.cancel(consumerTag);
                                }
                            }
                            catch (e) {
                                console.log({ consumerTag });
                                console.log(e.message.red);
                                reject(e.message);
                            }
                            finally {
                                return;
                            }
                        })
                            .catch((e) => {
                            console.log(e.message.red);
                            reject(e.message);
                        });
                    }))
                        .catch((error) => reject(error.message));
                };
                if (!this.channel)
                    setTimeout(process, 5000);
                else
                    process();
            }) /*  */
                .then((data) => {
                console.log({ data });
                return data;
            })
                .catch((e) => {
                console.log("Error in catch callback of Promise returned from receiveMessage: "
                    .bgYellow, e.message.bgRed);
            });
            // .finally(() => {
            //   console.log("Finished!".bgGreen);
            // });
        };
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            yield this.channel.close();
            yield this.connection.close();
        });
        this.setup();
    }
}
exports.TaskMessageService = TaskMessageService;
