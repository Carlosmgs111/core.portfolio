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
const inquirer_1 = __importDefault(require("inquirer"));
const colors_1 = __importDefault(require("colors"));
const login_1 = require("./handlers/login");
const certifications_1 = require("./handlers/certifications");
const projects_1 = require("./handlers/projects");
const utils_1 = require("../../../utils");
inquirer_1.default.registerPrompt("loop", require("inquirer-loop")(inquirer_1.default));
colors_1.default;
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const state = { token: undefined };
    const choices = ["Login", "Certifications", "Institutions", "Projects"];
    const EChoices = (0, utils_1.Enumfy)(choices);
    const options = {
        [EChoices.Login]: () => (0, login_1.loginHandler)(state),
        ["Logout"]: () => (state.token = undefined),
        [EChoices.Certifications]: certifications_1.certificationsHandler,
        [EChoices.Projects]: projects_1.projectsHandler,
    };
    while (true) {
        const { token } = state;
        if (token) {
            choices.shift();
            choices.unshift("Logout");
        }
        if (!token) {
            choices.shift();
            choices.unshift("Login");
        }
        const { option } = yield inquirer_1.default.prompt([
            {
                name: "option",
                type: "list",
                message: `
  Core Blogfolio
  ${token ? "Logged".green : "Unlogged".red}
        `.cyan,
                choices,
            },
        ]);
        yield (0, utils_1.execFunc)(options[option]);
    }
});
