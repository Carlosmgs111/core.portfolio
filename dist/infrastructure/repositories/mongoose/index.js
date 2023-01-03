"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../../config"));
console.log({ config: config_1.default });
const connect = () => mongoose_1.default.connect(config_1.default.mongoDBLocalUrl || config_1.default.mongoDBAtlasURL);
exports.connect = connect;
exports.connection = mongoose_1.default.connection;
// Callback once connection open
exports.connection.once("open", () => {
    console.log("Mongodb connection stablished");
});
exports.connection.on("error", (err) => {
    console.log(err);
    process.exit(0);
});
