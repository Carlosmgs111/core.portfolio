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
exports.CQRSService = void 0;
const DatabaseServices_1 = require("../DatabaseServices");
const Certification_1 = require("../../../domain/entities/Certification");
class CQRSService {
    constructor() {
        this.QueryService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.MongooseAdapter);
        this.CommandService = (0, DatabaseServices_1.DatabaseService)(DatabaseServices_1.Adapters.SequelizeAdapter);
        this.lastSync = 0;
        this.create = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.CommandService.create(entity, Entity, options); });
        this.createMany = (entity, entities, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.CommandService.createMany(entity, entities, options); });
        this.findOne = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findOne(entity, options); });
        this.findAll = (entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.QueryService.findAll(entity, options); });
        this.remove = (entity, options) => __awaiter(this, void 0, void 0, function* () { return yield this.CommandService.remove(entity, options); });
        this.update = (entity, Entity, options = {}) => __awaiter(this, void 0, void 0, function* () { return yield this.CommandService.update(entity, Entity, options); });
        this.relateN2N = (refs) => __awaiter(this, void 0, void 0, function* () { return yield this.CommandService.relateN2N(refs); });
        this.relate2One = (entity, refs) => __awaiter(this, void 0, void 0, function* () { return yield this.CommandService.relate2One(entity, refs); });
        this.unrelateN2N = (refs) => __awaiter(this, void 0, void 0, function* () { return yield this.CommandService.unrelateN2N(refs); });
        this.checkRelationship = this.CommandService.checkRelationship;
        this.entities = Object.assign(Object.assign({}, this.CommandService.entities), this.QueryService.entities);
        this.setupEntity = this.CommandService.setupEntity;
        this.sync = () => __awaiter(this, void 0, void 0, function* () {
            try {
                const certifications = yield Certification_1.Certification.findAll(this.CommandService, {
                    related: [
                        [
                            "User",
                            {
                                attributes: ["username", "uuid"],
                            },
                        ],
                        ["Institution", { attributes: ["name"], as: "Institution" }],
                    ],
                });
                yield Certification_1.Certification.createMany(this.QueryService, certifications.map((a) => (Object.assign(Object.assign({}, a), { emitedBy: a.Institution.name, user: a.Users[0] }))));
            }
            catch (e) {
                console.log(e.message.red);
            }
        });
        this.info = () => {
            return "Repository Service";
        };
    }
}
exports.CQRSService = CQRSService;
