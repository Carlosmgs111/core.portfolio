"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = exports.normalize = exports.labelCases = void 0;
const pluralize_1 = require("pluralize");
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
