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
const TYPE = "direct";
class TaskMessageService {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.consumers = {};
        this.getConnection = () => new Promise((resolve, reject) => {
            if (this.connection) {
                resolve(this.connection);
            }
            else {
                amqplib_1.default
                    .connect(rabbitMQUrl)
                    .then((connection) => {
                    this.connection = connection;
                    resolve(connection);
                })
                    .catch((error) => {
                    console.error("Error al conectar a RabbitMQ:", error);
                    reject(error);
                });
            }
        });
        this.getChannel = () => new Promise((resolve, reject) => {
            if (this.channel) {
                resolve(this.channel);
            }
            else {
                this.getConnection()
                    .then((_connection) => {
                    _connection
                        .createChannel()
                        .then((channel) => {
                        this.channel = channel;
                        resolve(channel);
                    })
                        .catch((error) => {
                        console.error("Error en setup:", error);
                        reject(error);
                    });
                })
                    .catch((e) => console.log({ e }));
            }
        }).then((data) => data);
        this.createExchange = (exchangeName, type = TYPE) => {
            const formatedExchangeName = `${exchangeName}/type=${type}`;
            return new Promise((resolve, reject) => {
                this.getChannel()
                    .then((_channel) => {
                    _channel
                        .assertExchange(formatedExchangeName, type, {
                        durable: false,
                        // exclusive: false,
                    })
                        .then(({ exchange }) => {
                        resolve(exchange);
                    })
                        .catch((e) => {
                        console.log({ "Error message in createExchange": e.message.red });
                    });
                })
                    .catch((e) => console.log(e));
            });
        };
        this.sendMessage = (payload, receiverFunc = undefined, conf = { type: TYPE }) => __awaiter(this, void 0, void 0, function* () {
            const { type } = conf;
            const [exchangeName, _payload] = (0, utils_1.Mapfy)(payload).entries().next().value;
            const [functionName, message] = (0, utils_1.Mapfy)(_payload).entries().next().value;
            const formatedExchangeName = `${exchangeName}/type=${type}`;
            const queueName = `${formatedExchangeName}_1`;
            this.createExchange(exchangeName).then(() => {
                this.getChannel()
                    .then((_channel) => {
                    _channel
                        .assertExchange(formatedExchangeName, type, {
                        durable: false,
                        // exclusive: true,
                    })
                        .finally(() => {
                        _channel.publish(formatedExchangeName, queueName, Buffer.from(JSON.stringify(message)));
                    })
                        .catch((e) => {
                        console.log({ "Error message in sendMessage": e.message.red });
                    });
                })
                    .catch((e) => console.log(e.message));
            });
            if (receiverFunc) {
                return this.receiveMessage(receiverFunc);
            }
            return this;
        });
        this.receiveMessage = (payload, type = TYPE) => {
            let [exchangeName, cb] = ["", (...[]) => { }];
            if (payload instanceof Function) {
                [exchangeName, cb] = [payload.name, payload];
            }
            else if (payload instanceof Object) {
                [exchangeName, cb] = (0, utils_1.Mapfy)(payload).entries().next().value;
            }
            const formatedExchangeName = `${exchangeName}/type=${type}`;
            const queueName = `${formatedExchangeName}_1`;
            if (!(0, utils_1.Mapfy)(this.consumers).has(queueName)) {
                this.consumers[queueName] = (resolve, reject) => {
                    this.getChannel().then((_channel) => {
                        _channel
                            .assertQueue(queueName, {
                            exclusive: true,
                            // durable: true,
                        })
                            .then((q) => __awaiter(this, void 0, void 0, function* () {
                            const { queue } = q;
                            _channel.bindQueue(queue, formatedExchangeName, queueName);
                            const { consumerTag } = yield _channel
                                .consume(queue, (message) => {
                                const decoded = JSON.parse(message.content.toString());
                                try {
                                    // console.log({ ...decoded });
                                    if (message !== null) {
                                        if (Array.isArray(decoded))
                                            cb(...decoded)
                                                .then((_message) => {
                                                console.log({ _message });
                                                // console.log({ _channel });
                                                resolve(_message);
                                                return _message;
                                            })
                                                .catch((e) => {
                                                console.log(e.message.bgRed);
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
                                        _channel.ack(message);
                                    }
                                }
                                catch (e) {
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
                    });
                };
            }
            return new Promise((resolve, reject) => {
                this.consumers[queueName](resolve, reject);
            })
                .then((data) => {
                console.log({ data });
                return data;
            })
                .catch((e) => {
                console.log("Error in catch callback of Promise returned from receiveMessage: "
                    .bgYellow, e.message.bgRed);
            });
            //  .finally(() => {
            //    console.log("Finished!".bgGreen);
            //  });
        };
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            yield this.channel.close();
            yield this.connection.close();
        });
    }
}
exports.TaskMessageService = TaskMessageService;
