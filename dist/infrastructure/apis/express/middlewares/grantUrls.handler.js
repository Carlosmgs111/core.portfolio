"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantUrls = void 0;
const auth_handler_1 = require("./auth.handler");
const dependencies_1 = require("../../../../config/dependencies");
const grantUrls = (urlsGranted) => {
    const urls = [
        { urls: [{ urls: [], methods: [] }], methods: [] },
        { urls: [], methods: [] },
    ];
    return (req, res, next) => {
        const { url, method, params, headers: { authorization }, } = req;
        req.token = (authorization || "").replace("Bearer ", "");
        let query;
        let param;
        let toGrantUrl;
        (() => {
            const grantedUrl = url
                .replace(`/api/${dependencies_1.apiConfig.version}/`, "")
                .replace(`/ui/${dependencies_1.uiConfig.version}/`, "")
                .split("/");
            [toGrantUrl, query] = grantedUrl.join("/").split("?");
        })();
        let isGranted = false;
        for (var urlGranted of urlsGranted) {
            let [grantedPaths, grantedMethods = []] = urlGranted;
            // console.log({ grantedPaths });
            grantedMethods = ["GET", ...grantedMethods];
            grantedPaths.map((grantedPath) => {
                if (grantedPath.includes(":")) {
                    // isGranted = true;
                    console.log({ grantedPath });
                }
            });
            const isIncluded = grantedPaths.includes(toGrantUrl) && grantedMethods.includes(method);
            if (isIncluded) {
                isGranted = true;
                break;
            }
        }
        isGranted ? next() : (0, auth_handler_1.authMiddleware)(req, res, next);
    };
};
exports.grantUrls = grantUrls;
