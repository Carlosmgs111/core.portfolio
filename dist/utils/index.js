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
exports.genRandomId = exports.listToMap = exports.mapToList = exports.fromEnumToArray = exports.createEnumFromArray = exports.capitalize = exports.normalize = exports.labelCases = exports.execFunc = exports.Enumfy = exports.setEnums = exports.getActionTypes = exports.settingName = exports.UnMapfy = exports.Mapfy = exports.getEntityProperties = exports.filterAttrs = exports.decryptData = exports.encryptData = void 0;
const pluralize_1 = require("pluralize");
const crypto_js_1 = __importDefault(require("crypto-js"));
function encryptData(data, key) {
    return crypto_js_1.default.RC4.encrypt(data, key).toString();
}
exports.encryptData = encryptData;
function decryptData(data, key) {
    const bytes = crypto_js_1.default.RC4.decrypt(data, key);
    return bytes.toString(crypto_js_1.default.enc.Utf8);
}
exports.decryptData = decryptData;
const filterAttrs = (obj, toRemove, oclusive = true) => {
    const newObj = {};
    for (var attr in obj) {
        // if (!obj[attr]) (`⚠️ ${attr}: Its null or undefined ⚠️`.yellow);
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
const Mapfy = (object) => new Map(Object.entries(object));
exports.Mapfy = Mapfy;
const UnMapfy = (map) => Object.fromEntries(map.entries());
exports.UnMapfy = UnMapfy;
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
    if (typeof func !== "function") {
        "Not implemented yet!".red;
        return;
    }
    try {
        yield func();
    }
    catch (e) {
        e.message.red;
    }
});
exports.execFunc = execFunc;
/**
 * @LP Lower Case Plural (LowerPlural)
 * @LS Lower Case Singular (LowerSingle)
 * @CP Camel Case Plural (CamelPlural)
 * @CS Camel Case Singular (CamelSingle)
 * @UP Upper Case Plural (UpperPlural)
 * @US Upper Case Singular (UpperSingle)
 */
const labelCases = (label, normal = true) => {
    label = normal ? (0, exports.normalize)(label) : label;
    return Object.defineProperties(Object(String(label)), {
        LP: { value: (0, pluralize_1.plural)(label.toLowerCase()), writable: false },
        LS: { value: (0, pluralize_1.singular)(label.toLowerCase()), writable: false },
        CP: { value: (0, pluralize_1.plural)((0, exports.capitalize)(label)), writable: false },
        CS: { value: (0, pluralize_1.singular)((0, exports.capitalize)(label)), writable: false },
        UP: { value: (0, pluralize_1.plural)(label).toUpperCase(), writable: false },
        US: { value: (0, pluralize_1.singular)(label).toUpperCase(), writable: false },
        toString: { value: () => label },
    });
};
exports.labelCases = labelCases;
const normalize = (str) => {
    const from = "ÃÀÁÄÂÈÉËÊÌÍÏÎÒÓÖÔÙÚÜÛãàáäâèéëêìíïîòóöôùúüûÑñÇç", to = "AAAAAEEEEIIIIOOOOUUUUaaaaaeeeeiiiioooouuuunncc", mapping = {};
    for (var i = 0, j = from.length; i < j; i++)
        mapping[from.charAt(i)] = to.charAt(i);
    var ret = [];
    for (var i = 0, j = str.length; i < j; i++) {
        var c = str.charAt(i);
        if (mapping.hasOwnProperty(str.charAt(i)))
            ret.push(mapping[c]);
        else
            ret.push(c);
    }
    return ret.join("");
};
exports.normalize = normalize;
const capitalize = (label, pluralize = false) => {
    return (label[0].toUpperCase() +
        label.slice(1).toLowerCase() +
        (pluralize ? "s" : ""));
};
exports.capitalize = capitalize;
const createEnumFromArray = (array) => Object.freeze(Object.fromEntries(array.map((item) => [item, item])));
exports.createEnumFromArray = createEnumFromArray;
const fromEnumToArray = (_enum) => new Array(Object.entries(_enum))[0]
    .splice(Object.entries(_enum).length / 2)
    .flatMap((e) => e[0]);
exports.fromEnumToArray = fromEnumToArray;
const mapToList = (data, onlyValues = true) => Object.entries(Object.assign({}, data)).map((data) => (onlyValues ? data[1] : data));
exports.mapToList = mapToList;
const listToMap = (data) => Object.fromEntries([...data].map((data, index) => [index, data]));
exports.listToMap = listToMap;
const genRandomId = () => {
    return Number(String(Math.random()).replace("0.", ""));
};
exports.genRandomId = genRandomId;
