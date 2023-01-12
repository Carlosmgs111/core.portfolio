"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync = void 0;
const dependencies_1 = require("../../config/dependencies");
const sync = () => {
    dependencies_1.RepositoryService.sync();
};
exports.sync = sync;
