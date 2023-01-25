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
exports.testsHandler = void 0;
const dependencies_1 = require("../../../../config/dependencies");
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("../../../../utils");
inquirer_1.default.registerPrompt("loop", require("inquirer-loop")(inquirer_1.default));
const testsHandler = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const sequelizeAdapter = dependencies_1.RepositoryService.CommandService;
    const mongooseAdapter = dependencies_1.RepositoryService.QueryService;
    const { username } = state;
    let running = true;
    const [checkN2N, removeN2N, exit] = [
        "Check Relationship N2N",
        "Remove Relationship N2N",
        "Salir",
    ];
    const choices = [checkN2N, removeN2N, exit];
    const options = {
        [checkN2N]: () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(yield sequelizeAdapter.checkOneRelationshipN2N({ certification: { title: "0" } }, { user: { username } }));
        }),
        [removeN2N]: () => __awaiter(void 0, void 0, void 0, function* () {
            console.log(yield mongooseAdapter.removeOneRelationshipN2N([
                [{ institution: { name: "EDTeam" } }, { user: { username } }],
            ]));
        }),
        [exit]: () => __awaiter(void 0, void 0, void 0, function* () { return (running = false); }),
    };
    while (running) {
        const { option } = yield inquirer_1.default.prompt([
            {
                name: "option",
                type: "list",
                message: "Tests".bgYellow,
                choices,
            },
        ]);
        yield (0, utils_1.execFunc)(options[option]);
    }
});
exports.testsHandler = testsHandler;
