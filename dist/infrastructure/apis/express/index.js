"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../../../config"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const path_1 = require("path");
const error_handler_1 = require("./middlewares/error.handler");
// import authRoutes from "./routes/auth.routes";
// import passport from "../../auth/passport";
const grantUrls_handler_1 = require("./middlewares/grantUrls.handler");
// Create a new app server
exports.app = (0, express_1.default)();
exports.app
    .set("port", config_1.default.serverPort)
    .use((0, morgan_1.default)("dev"))
    .use((0, cors_1.default)({ origin: true }))
    .use(express_1.default.json({ limit: "200mb" }))
    .use(express_1.default.urlencoded({ limit: "200mb", extended: false }))
    .set("view engine", "pug")
    .set("views", (0, path_1.join)((0, path_1.dirname)((0, path_1.dirname)(__dirname)), "templates"))
    // .use(authRoutes)
    // .use(passport)
    .use((0, grantUrls_handler_1.grantUrls)([
    [["signin", "signup"], ["POST"]],
    [["certifications", "certifications/:username"]],
    [
        [
            "institutions",
            "skills",
            "projects",
            "cqrs",
            "users/username/all",
            "notes",
        ],
    ],
]))
    /* to check */
    .use((req, res, next) => {
    // Dominio que tengan acceso (ej. 'http://example.com')
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Metodos de solicitud que deseas permitir
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    // Encabecedados que permites (ej. 'X-Requested-With,content-type')
    res.setHeader("Access-Control-Allow-Headers", "*");
    next();
})
    .use(routes_1.default)
    .use(error_handler_1.logErrors)
    .use(error_handler_1.ormErrorHandler)
    .use(error_handler_1.boomErrorHandler)
    .use(error_handler_1.errorHandler);
exports.default = () => exports.app.listen(exports.app.get("port"), () => {
    console.log(`🚀💼 Portfolio app listening on port ${exports.app.get("port")}`);
});
