"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntityProperties = exports.filterAttrs = void 0;
const filterAttrs = (obj, toRemove, oclusive = true) => {
    const newObj = {};
    for (var attr in obj) {
        if (!oclusive === toRemove.includes(attr)) {
            newObj[attr] = obj[attr];
        }
    }
    return newObj;
};
exports.filterAttrs = filterAttrs;
const getEntityProperties = (Entity) => {
    const newObj = {};
    for (var attr in Entity) {
        if (typeof Entity[attr] !== "function")
            newObj[attr] = Entity[attr];
    }
    return newObj;
};
exports.getEntityProperties = getEntityProperties;
