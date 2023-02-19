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
exports.LocalStrategy = void 0;
const passport_local_1 = require("passport-local");
const register_1 = require("../../../../modules/users/application/register");
exports.LocalStrategy = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password"
}, function (email, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const entity = yield (0, register_1.authSignin)({ email, password });
            return done(null, entity);
        }
        catch (e) {
            done(e, false);
        }
    });
});
