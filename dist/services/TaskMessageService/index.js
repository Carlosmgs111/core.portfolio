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
        this.getChannel = () => __awaiter(this, void 0, void 0, function* () {
            if (this.channel) {
                return this.channel;
            }
            else {
                const connection = yield this.connectToRabbitMQ();
                try {
                    const channel = yield connection.createChannel();
                    this.channel = channel;
                    return channel;
                }
                catch (e) {
                    console.log(e.message.red);
                }
            }
        });
        this.assertExchange = (exchangeName, type = TYPE) => __awaiter(this, void 0, void 0, function* () {
            const formatedExchangeName = `${exchangeName}/type=${type}`;
            const _channel = yield this.getChannel();
            const { exchange } = yield _channel.assertExchange(formatedExchangeName, type, {
                durable: false,
                // exclusive: false,
            });
            return exchange;
        });
        this.sendMessage = (payload, receiverFunc = undefined, conf = { type: TYPE }) => __awaiter(this, void 0, void 0, function* () {
            const { type } = conf;
            const [exchangeName, _payload] = (0, utils_1.Mapfy)(payload).entries().next().value;
            const [functionName, message] = (0, utils_1.Mapfy)(_payload).entries().next().value;
            const formatedExchangeName = `${exchangeName}/type=${type}`;
            const queueName = `${formatedExchangeName}_1`;
            try {
                yield this.assertExchange(exchangeName);
                const _channel = yield this.getChannel();
                yield _channel.publish(formatedExchangeName, queueName, Buffer.from(JSON.stringify(message)));
            }
            catch (e) {
                console.log(e.message.gbRed);
            }
            if (receiverFunc) {
                yield this.receiveMessage(receiverFunc);
            }
            return this;
        });
        this.receiveMessage = (payload, type = TYPE) => __awaiter(this, void 0, void 0, function* () {
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
                yield this.assertExchange(exchangeName);
                const _channel = yield this.getChannel();
                const { queue } = yield _channel.assertQueue(queueName, {
                    exclusive: true,
                });
                yield _channel
                    .bindQueue(queue, formatedExchangeName, queueName)
                    .catch((e) => console.log({ e: e.message }));
                const consumerTag = yield _channel.consume(queue, (message) => {
                    if (message !== null) {
                        const decoded = JSON.parse(message.content.toString());
                        if (Array.isArray(decoded))
                            cb(...decoded)
                                .then((_result) => {
                                console.log({ _result });
                            })
                                .catch((err) => console.log({ err }));
                        else
                            cb(decoded).then((_result) => {
                                console.log({ _result });
                            });
                        _channel.ack(message);
                    }
                });
                this.consumers[queueName] = consumerTag;
            }
        });
        this.addEvent = (cb) => { };
        this.close = () => __awaiter(this, void 0, void 0, function* () {
            yield this.channel.close();
            yield this.connection.close();
        });
        (() => __awaiter(this, void 0, void 0, function* () {
            this.connection = yield this.connectToRabbitMQ();
            yield this.getChannel();
        }))();
    }
    connectToRabbitMQ() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.connection) {
                return this.connection;
            }
            try {
                this.connection = yield amqplib_1.default.connect(rabbitMQUrl);
                this.connection.on("close", () => {
                    this.channel.close();
                    this.channel = null;
                    this.connection = null;
                });
                return this.connection;
            }
            catch (error) {
                console.error("Error al conectar a RabbitMQ: ", error);
                throw error;
            }
        });
    }
}
exports.TaskMessageService = TaskMessageService;
