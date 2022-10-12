"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = exports.ServicesInterfaceEnums = exports.ServicesInterface = void 0;
const utils_1 = require("../../../utils");
const DatabaseMongooseService_1 = __importDefault(require("./DatabaseMongooseService"));
const DatabaseSequelizeService_1 = __importDefault(require("./DatabaseSequelizeService"));
exports.ServicesInterface = {
    DatabaseMongooseService: DatabaseMongooseService_1.default,
    DatabaseSequelizeService: DatabaseSequelizeService_1.default,
};
exports.ServicesInterfaceEnums = (0, utils_1.setEnums)([
    DatabaseSequelizeService_1.default.name,
    DatabaseMongooseService_1.default.name,
]);
console.log({ ServicesInterface: exports.ServicesInterface });
const DatabaseService = (service = exports.ServicesInterfaceEnums.DatabaseSequelizeService) => {
    console.log({ service });
    class DatabaseService extends exports.ServicesInterface[service] {
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
