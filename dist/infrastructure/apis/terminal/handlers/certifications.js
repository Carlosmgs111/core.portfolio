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
exports.certificationsHandler = void 0;
const use_cases_1 = require("../../../../modules/certifications/use_cases");
const use_cases_2 = require("../../../../modules/users/use_cases");
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("../../../../utils");
inquirer_1.default.registerPrompt("loop", require("inquirer-loop")(inquirer_1.default));
const listByUsernameHandler = (state) => __awaiter(void 0, void 0, void 0, function* () {
    let running = true;
    const usernames = yield (0, use_cases_2.getAllUsername)();
    const exit = "Salir";
    const choices = [...usernames, exit];
    while (running) {
        const { option } = yield inquirer_1.default.prompt([
            {
                name: "option",
                type: "list",
                message: "Certification".cyan,
                choices,
            },
        ]);
        (yield (0, use_cases_1.getCertifications)({ username: option }));
        if (option === exit)
            running = false;
    }
});
const listCertificationsHandler = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = state;
    const [all, owns, byUser, test] = ["Todos", "Propios", "Por Usuario", "Test"];
    const choices = [all, owns, byUser, test];
    const options = {
        [all]: () => __awaiter(void 0, void 0, void 0, function* () { return (yield (0, use_cases_1.getCertifications)({})); }),
        [owns]: () => __awaiter(void 0, void 0, void 0, function* () { return (yield (0, use_cases_1.getOwnCertifications)({ token })); }),
        [byUser]: () => __awaiter(void 0, void 0, void 0, function* () { return yield listByUsernameHandler(state); }),
        [test]: () => { },
    };
    const { option } = yield inquirer_1.default.prompt([
        {
            type: "list",
            name: "option",
            choices,
        },
    ]);
    yield (0, utils_1.execFunc)(options[option]);
});
const certificationsHandler = (state) => __awaiter(void 0, void 0, void 0, function* () {
    let running = true;
    const [add, update, removeOne, read, exit] = [
        "Agregar",
        "Actualizar",
        "Eliminar",
        "Listar",
        "Salir",
    ];
    const choices = [add, update, removeOne, read, exit];
    const options = {
        [read]: () => __awaiter(void 0, void 0, void 0, function* () { return yield listCertificationsHandler(state); }),
        [exit]: () => __awaiter(void 0, void 0, void 0, function* () { return (running = false); }),
    };
    while (running) {
        const { option } = yield inquirer_1.default.prompt([
            {
                name: "option",
                type: "list",
                message: "Certification".cyan,
                choices,
            },
        ]);
        yield (0, utils_1.execFunc)(options[option]);
    }
});
exports.certificationsHandler = certificationsHandler;
