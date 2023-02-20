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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewNote = exports.getMyNotes = void 0;
const entity_1 = require("./entity");
const entity_2 = require("../users/entity");
const dependencies_1 = require("../../config/dependencies");
const getMyNotes = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = data;
    console.log({ user });
    const myNotes = (yield entity_2.User.find(dependencies_1.RepositoryService, {
        credentials: { uuid: user.uuid },
        related: [["Note"]],
    })).Notes;
    return myNotes;
});
exports.getMyNotes = getMyNotes;
const createNewNote = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = data, attrs = __rest(data, ["user"]);
    const note = yield entity_1.Note.createOne(dependencies_1.RepositoryService, Object.assign(Object.assign({}, attrs), { userUUID: user.uuid }));
    return note;
});
exports.createNewNote = createNewNote;
