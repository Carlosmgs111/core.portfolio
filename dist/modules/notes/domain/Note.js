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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Note = void 0;
const uuid_1 = require("uuid");
const utils_1 = require("../../../utils");
class Note {
    constructor({ uuid, title, body, tags }) {
        this.uuid = "";
        this.title = "";
        this.body = ""; // * timestamp
        this.createdAt = 0;
        this.updatedAt = 0;
        this.update = (RepositoryService, data) => __awaiter(this, void 0, void 0, function* () {
            this.updatedAt = new Date().getTime();
            yield RepositoryService.updateOne(RepositoryService.entities.Note, Object.assign({ updatedAt: this.updatedAt }, (0, utils_1.filterAttrs)(data, ["uuid", "user", "token"])), { credentials: { uuid: this.uuid } });
            return this;
        });
        this.remove = (RepositoryService, options = {}) => __awaiter(this, void 0, void 0, function* () {
            yield RepositoryService.unsetOneRelationship2One({ certifications: { uuid: this.uuid } }, [["Institution", { as: "Institution" }]]);
            const removed = yield RepositoryService.removeOneRelationshipN2N([
                [{ user: { uuid: options.userUUID } }, { note: { uuid: this.uuid } }],
            ]);
            if (!removed)
                return;
            return yield RepositoryService.removeOne(RepositoryService.entities.Note, {
                credentials: (0, utils_1.filterAttrs)((0, utils_1.getEntityProperties)(this), ["title", "uuid"], false),
            });
        });
        this.uuid = uuid;
        this.title = title;
        this.body = body;
        this.tags = tags;
        this.createdAt = new Date().getTime();
        this.updatedAt = this.createdAt;
    }
}
exports.Note = Note;
_a = Note;
Note.createOne = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    const uuid = data.uuid || (0, uuid_1.v4)();
    const { userUUID } = data, attrs = __rest(data, ["userUUID"]);
    const note = yield RepositoryService.createOne(RepositoryService.entities.Note, new Note(Object.assign(Object.assign({}, attrs), { uuid })));
    yield RepositoryService.setOneRelationship2One({ notes: { uuid: note.uuid } }, [
        {
            user: { uuid: userUUID },
        },
    ]);
    return note;
});
Note.createMany = (RepositoryService, data) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log({ data });
    const notesCreated = yield RepositoryService.createMany(RepositoryService.entities.Note, data.map((c) => new Note(Object.assign(Object.assign({}, c), { uuid: c.uuid || (0, uuid_1.v4)() }))));
    for (let note in notesCreated) {
        yield RepositoryService.setOneRelationship2One({ notes: { uuid: notesCreated[note].uuid } }, [
            {
                user: { uuid: data[note].userUUID },
            },
        ]);
    }
    return notesCreated;
});
Note.load = (RepositoryService, options) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield Note.find(RepositoryService, options);
    if (!note)
        throw new Error("Incorrect credentials!");
    const loadedNote = new Note(note);
    console.log({ loadedNote });
    return loadedNote;
});
Note.find = (RepositoryService, options) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield RepositoryService.findOne(RepositoryService.entities.Note, options);
    return note;
});
Note.findAll = (RepositoryService, options = {}) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ options });
    const notes = yield RepositoryService.findAll(RepositoryService.entities.Note, options);
    return notes;
});
