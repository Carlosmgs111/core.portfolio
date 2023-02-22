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
const institutions_1 = require("./handlers/institutions");
const tests_1 = require("./handlers/tests");
const utils_1 = require("../../../utils");
const certification_fake_1 = require("../../../testing/fakers/certification.fake");
const fs_1 = __importDefault(require("fs"));
const random_words_1 = __importDefault(require("random-words"));
inquirer_1.default.registerPrompt("loop", require("inquirer-loop")(inquirer_1.default));
colors_1.default;
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const tokens = {
        re: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE2NzU2MzI1Nzc1MDksInV1aWQiOiIzOTVhZTE5OS1mOGU2LTRjNmEtODQ1ZS0zODdiNmE3MDQ3NTgiLCJ1c2VybmFtZSI6InJlYXBlcjM0MyIsImVtYWlsIjoicmVhcGVyMzQzbjdAZ21haWwuY29tIiwicHJpdmlsZWdlIjoiYWRtaW4iLCJhdmF0YXIiOiJodHRwczovL2ltYWdlczIuYWxwaGFjb2RlcnMuY29tLzExOS90aHVtYi0xOTIwLTExOTg0Mi5qcGciLCJpYXQiOjE2NzcwOTM3MjcsImV4cCI6MTY3OTY4NTcyN30.7cQJQbfZ55Le10Pe495YA6T5EbkiLaBjPOJ-QJrPwVo",
        cm: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjcmVhdGVkQXQiOjE2NzQ3MDg1NzA1NTgsInV1aWQiOiIyNGZkODZkOC0zNTgwLTRjYWItYWExZS02ZTM4NzMzNGQwOWIiLCJ1c2VybmFtZSI6ImNtZ3MxMTEiLCJlbWFpbCI6ImNhcmxvc21nczExMUBvdXRsb29rLmNvbSIsInByaXZpbGVnZSI6ImFkbWluIiwiYXZhdGFyIjoiaHR0cHM6Ly9pLnJlZGQuaXQvY2RhZzV5ajkwZmM1MS5qcGciLCJpYXQiOjE2NzcwOTU4OTEsImV4cCI6MTY3OTY4Nzg5MX0.lHvHHTBHq0q1ne-AF1wFztyDwKJoSbuIseGk0JFtSN4",
        no: null,
    };
    const usernames = { re: "reapern7", cm: "cmgs111" };
    const state = {
        token: tokens.cm,
        username: usernames.cm,
        exp: 0,
    };
    const [login, logout, user, certifications, institutions, projects, tests, datasets,] = [
        "Login".bgGreen,
        "Logout".bgRed,
        "User",
        "Certifications",
        "Institutions",
        "Projects",
        "Tests".yellow,
        "Datasets".blue,
    ];
    const choices = [
        user,
        certifications,
        institutions,
        projects,
        tests,
        datasets,
    ];
    const options = {
        [login]: () => (0, login_1.loginHandler)(state),
        [logout]: () => (state.token = undefined),
        [certifications]: () => (0, certifications_1.certificationsHandler)(state),
        [institutions]: () => (0, institutions_1.institutionsHandler)(state),
        [projects]: () => (0, projects_1.projectsHandler)(state),
        [tests]: () => (0, tests_1.testsHandler)(state),
        [datasets]: () => {
            const qt = 100;
            fs_1.default.writeFileSync(`datasets/certifications/${new Date()
                .toISOString()
                .replace(/T/, "_")
                .replace(/\..+/, "")
                .replaceAll(":", ".")}_qt.${qt}_${(0, random_words_1.default)(1)[0]}-${(0, random_words_1.default)(1)[0]}.json`, JSON.stringify({
                certifications: (0, certification_fake_1.generateManyCertifications)(qt),
            }));
        },
    };
    while (true) {
        const { token } = state;
        if (token && choices[choices.length - 1] !== logout) {
            choices.length > 4 && choices.shift();
            choices.push(logout);
        }
        if (!token && choices[0] !== login) {
            choices.length > 4 && choices.pop();
            choices.unshift(login);
        }
        const { option } = yield inquirer_1.default.prompt([
            {
                name: "option",
                type: "list",
                message: `
        
  Blogfolio

  ${token ? `🔓 Logged: ${state.username} 🤖`.green : "🔒 Unlogged ".red}
        `.cyan,
                choices,
            },
        ]);
        yield (0, utils_1.execFunc)(options[option]);
    }
});
