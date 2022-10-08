"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ormErrorHandler = exports.boomErrorHandler = exports.errorHandler = exports.logErrors = void 0;
const { ValidationError } = require("sequelize");
const boom = require("@hapi/boom");
function logErrors(err, req, res, next) {
    console.error(err);
    next(err);
}
exports.logErrors = logErrors;
function errorHandler(err, req, res, next) {
    if (!err.isBoom) {
        res.status(500).json({
            message: err.message,
            stack: err.stack,
        });
    }
}
exports.errorHandler = errorHandler;
function boomErrorHandler(err, req, res, next) {
    if (err.isBoom) {
        const { output } = err;
        res.status(output.statusCode).json(output.payload);
    }
    next(err);
}
exports.boomErrorHandler = boomErrorHandler;
function ormErrorHandler(err, req, res, next) {
    if (err instanceof ValidationError) {
        res.status(409).json({
            statusCode: 409,
            message: err.name,
            errors: err.errors,
        });
    }
    next(err);
}
exports.ormErrorHandler = ormErrorHandler;
