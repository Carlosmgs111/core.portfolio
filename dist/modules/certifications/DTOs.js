"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatCertifications = void 0;
const utils_1 = require("../../utils");
const formatCertifications = (certifications) => certifications
    .map((certification) => (0, utils_1.filterAttrs)(Object.assign(Object.assign({}, certification), { emitedAt: new Date(certification.emitedAt).getTime(), grantedTo: certification.Users[0].username, emitedBy: certification.Institution.name }), ["Users", "Institution"]))
    .sort((a, b) => {
    if (a.emitedAt < b.emitedAt)
        return 1;
    return -1;
});
exports.formatCertifications = formatCertifications;
