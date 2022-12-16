"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantUrls = void 0;
const auth_handler_1 = require("./auth.handler");
const dependencies_1 = require("../../../../config/dependencies");
const grantUrls = (urlsGranted) => {
    return (req, res, next) => {
        const { url, method } = req;
        let isGranted = false;
        for (var urlGranted of urlsGranted) {
            let [pathsGranted, methodsGranted = []] = urlGranted;
            methodsGranted = ["GET", ...methodsGranted];
            const isIncluded = pathsGranted.includes(url
                .replace(`/api/${dependencies_1.apiConfig.version}/`, "")
                .replace(`/ui/${dependencies_1.uiConfig.version}/`, "")
                .split("/")[0]
                .split("?")[0]) && methodsGranted.includes(method);
            if (isIncluded) {
                isGranted = true;
                break;
            }
        }
        isGranted ? next() : (0, auth_handler_1.authMiddleware)(req, res, next);
    };
};
exports.grantUrls = grantUrls;
