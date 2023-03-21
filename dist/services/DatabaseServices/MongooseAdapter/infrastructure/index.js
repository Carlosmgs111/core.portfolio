"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection = exports.connect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../../../config"));
const test = !false;
const localURL = test ? config_1.default.mongoDBTestUrl : config_1.default.mongoDBLocalUrl;
const connect = () => mongoose_1.default.connect(localURL || config_1.default.mongoDBAtlasURL || "");
exports.connect = connect;
exports.connection = mongoose_1.default.connection;
// Callback once connection open
exports.connection.once("open", () => {
    ("Mongodb connection stablished");
});
exports.connection.on("error", (err) => {
    (err);
    process.exit(0);
});
