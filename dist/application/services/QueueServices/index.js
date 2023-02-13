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
exports.QueueService = exports.createQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const config_1 = __importDefault(require("../../../config"));
const redisUrlConnection = config_1.default.redisUrlDev || config_1.default.redisUrlProd;
console.log({ redisUrlConnection });
const createQueue = (alias, redisUrl = redisUrlConnection) => new QueueService(alias, redisUrl);
exports.createQueue = createQueue;
class QueueService extends bull_1.default {
    constructor(alias, options = {
        redis: {
            host: "127.0.0.1",
            port: 6379,
        },
    }) {
        super(alias, options);
        this.setProcess = (process) => {
            this.process((job, done) => __awaiter(this, void 0, void 0, function* () {
                const { data } = job;
                try {
                    if (Array.isArray(data))
                        yield process(...data);
                    else
                        yield process(data);
                    done(null, { message: "Process completed succesfully!" });
                }
                catch (e) {
                    console.error(e);
                    job.fail(e);
                }
            }));
            return this;
        };
        this.addJob = (job, options = {
            attempts: 3,
            backoff: { type: "exponential", delay: 60000 },
        }) => {
            this.add(job, options);
            return this;
        };
    }
}
exports.QueueService = QueueService;
