"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setEnums = exports.getActionTypes = exports.settingName = exports.Mapfy = exports.capitalize = exports.getEntityProperties = exports.filterAttrs = void 0;
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
const capitalize = (label, pluralize = false) => {
    return (label[0].toUpperCase() +
        label.slice(1).toLowerCase() +
        (pluralize ? "s" : ""));
};
exports.capitalize = capitalize;
const Mapfy = (object) => new Map(Object.entries(object));
exports.Mapfy = Mapfy;
const settingName = (value) => "set" + value.slice(0, 1).toUpperCase() + value.slice(1);
exports.settingName = settingName;
const getActionTypes = (object) => {
    const actionTypes = {};
    for (var key of object.keys()) {
        actionTypes[(0, exports.settingName)(key)] = (0, exports.settingName)(key);
    }
    actionTypes["reset"] = "reset";
    return actionTypes;
};
exports.getActionTypes = getActionTypes;
const setEnums = (enums, entity = {}) => {
    // enums = [...enums, "reset"];
    const types = {};
    enums.forEach((E) => (types[E] = E));
    return Object.freeze(Object.assign({}, types));
};
exports.setEnums = setEnums;
