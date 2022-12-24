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
exports.projectsHandler = void 0;
const projects_1 = require("../../../../application/use_cases/projects");
const inquirer_1 = __importDefault(require("inquirer"));
const utils_1 = require("../../../../utils");
inquirer_1.default.registerPrompt("loop", require("inquirer-loop")(inquirer_1.default));
const projectsHandler = (state) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = state;
    let running = true;
    const choices = ["Agregar", "Actualizar", "Eliminar", "Listar", "Salir"];
    const EChoices = (0, utils_1.Enumfy)(choices);
    const options = {
        [EChoices.Listar]: () => __awaiter(void 0, void 0, void 0, function* () { return console.log(yield (0, projects_1.getProjects)({ username })); }),
        [EChoices.Salir]: () => __awaiter(void 0, void 0, void 0, function* () { return (running = false); }),
    };
    while (running) {
        const { option } = yield inquirer_1.default.prompt([
            {
                name: "option",
                type: "list",
                message: "Projects".cyan,
                choices,
            },
        ]);
        yield (0, utils_1.execFunc)(options[option]);
    }
});
exports.projectsHandler = projectsHandler;
