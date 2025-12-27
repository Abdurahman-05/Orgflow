"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivateAccountSchema = exports.RefreshSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.RefreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string(),
});
exports.ActivateAccountSchema = zod_1.z.object({
    token: zod_1.z.string(),
    password: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string()
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});
