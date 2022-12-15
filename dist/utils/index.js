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
Object.defineProperty(exports, "__esModule", { value: true });
exports.execFunc = exports.Enumfy = exports.setEnums = exports.getActionTypes = exports.settingName = exports.Mapfy = exports.capitalize = exports.getEntityProperties = exports.filterAttrs = void 0;
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
const Enumfy = (object) => {
    const enumObj = {};
    if (Array.isArray(object))
        object.forEach((i) => (enumObj[i] = i));
    return Object.freeze(enumObj);
};
exports.Enumfy = Enumfy;
const execFunc = (func) => __awaiter(void 0, void 0, void 0, function* () {
    typeof func === "function"
        ? yield func()
        : console.log("Not implemented yet!".red);
});
exports.execFunc = execFunc;
