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
        this.setup = () => __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield amqplib_1.default.connect("amqp://localhost");
            }
            catch (error) {
                console.log("Error al establecer la conexión", error);
            }
        });
        this.createQueue = (queueName) => __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = yield this.connection.createChannel();
                yield channel.assertQueue(queueName);
            }
            catch (error) {
                console.log("Error al crear la cola", error);
            }
            return this;
        });
        this.sendMessage = (queueName, message) => __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.connection.createChannel();
            try {
                yield channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
            }
            catch (error) {
                console.log("Error al enviar el mensaje", error);
            }
            return this;
        });
        this.receiveMessage = (queueName, cb) => __awaiter(this, void 0, void 0, function* () {
            const channel = yield this.connection.createChannel();
            try {
                yield channel.assertQueue(queueName, { durable: true });
                channel.consume(queueName, (message) => {
                    if (message !== null) {
                        if (Array.isArray(JSON.parse(message.content.toString())))
                            cb(...JSON.parse(message.content.toString()));
                        else
                            cb(JSON.parse(message.content.toString()));
                        channel.ack(message);
                    }
                });
            }
            catch (error) {
                console.error(`Error occurred while receiving message: ${error}`);
            }
        });
        this.setup();
    }
}
exports.QueueService = QueueService;
