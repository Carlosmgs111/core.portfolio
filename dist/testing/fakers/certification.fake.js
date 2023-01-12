"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateManyCertifications = exports.generateOneCertification = void 0;
const faker_1 = require("@faker-js/faker");
const generateOneCertification = (count = 0) => ({
    title: `${faker_1.faker.helpers
        .fake("{{commerce.productAdjective}}: {{commerce.productDescription}} ")
        .toUpperCase()} ${count}`,
    emitedAt: Number(faker_1.faker.datatype.datetime({ min: 1577836800000 }).getTime()),
    emitedBy: "Platzi",
    image: `${faker_1.faker.image.avatar()} ${count}`,
    url: `${faker_1.faker.internet.url()} ${count}`,
});
exports.generateOneCertification = generateOneCertification;
// generate many fake users
const generateManyCertifications = (size = 10) => {
    const fakeProjects = [];
    for (let idx = 0; idx < size; idx++) {
        fakeProjects.push((0, exports.generateOneCertification)(Number(idx)));
    }
    return [...fakeProjects];
};
exports.generateManyCertifications = generateManyCertifications;
