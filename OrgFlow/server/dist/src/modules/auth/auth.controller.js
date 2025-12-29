"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandler = registerHandler;
exports.loginHandler = loginHandler;
exports.refreshTokenHandler = refreshTokenHandler;
const auth_service_1 = require("./auth.service");
const auth_schema_1 = require("./auth.schema");
async function registerHandler(req, res, next) {
    try {
        const input = auth_schema_1.registerSchema.parse(req.body);
        const user = await (0, auth_service_1.registerUser)(input);
        res.status(201).json(user);
    }
    catch (e) {
        next(e);
    }
}
async function loginHandler(req, res, next) {
    try {
        const input = auth_schema_1.loginSchema.parse(req.body);
        const { accessToken, refreshToken } = await (0, auth_service_1.loginUser)(input);
        res.status(200).json({ accessToken, refreshToken });
    }
    catch (e) {
        next(e);
    }
}
async function refreshTokenHandler(req, res, next) {
    try {
        const input = auth_schema_1.refreshTokenSchema.parse(req.body);
        const { accessToken } = await (0, auth_service_1.refreshUserToken)(input.refreshToken);
        res.status(200).json({ accessToken });
    }
    catch (e) {
        next(e);
    }
}
