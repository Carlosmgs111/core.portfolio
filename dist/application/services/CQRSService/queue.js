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
exports.addJobToQueue = exports.setProcessToQueue = exports.addQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const addQueue = (alias, options = {
    redis: {
        host: "127.0.0.1",
        port: 6379,
    },
}) => {
    return new bull_1.default(alias, options);
};
exports.addQueue = addQueue;
const setProcessToQueue = (queue, process) => {
    queue.process((job, done) => __awaiter(void 0, void 0, void 0, function* () {
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
};
exports.setProcessToQueue = setProcessToQueue;
const addJobToQueue = (queue, job, options = { attempts: 3, backoff: { type: "exponential", delay: 60000 } }) => {
    queue.add(job, options);
};
exports.addJobToQueue = addJobToQueue;
