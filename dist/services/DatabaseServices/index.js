"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = exports.Adapters = void 0;
const SequelizeAdapter_1 = __importDefault(require("./SequelizeAdapter"));
const MongooseAdapter_1 = __importDefault(require("./MongooseAdapter"));
exports.Adapters = {
    SequelizeAdapter: SequelizeAdapter_1.default,
    MongooseAdapter: MongooseAdapter_1.default,
};
const DatabaseService = (adapter = exports.Adapters.SequelizeAdapter) => {
    class DatabaseService extends adapter {
        constructor(props) {
            super(props);
        }
        info() {
            console.table({ "Database Service": this.serviceDescription });
            return { databaseInterfaceName: this.serviceDescription };
        }
    }
    return new DatabaseService({});
};
exports.DatabaseService = DatabaseService;
