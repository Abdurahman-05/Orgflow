"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const EnvSchema = zod_1.z.object({
    DATABASE_URL: zod_1.z.string(),
    PORT: zod_1.z.string().default("4000"),
    BACKEND_URL: zod_1.z.string().default("http://localhost:5000"),
    JWT_SECRET: zod_1.z.string(),
});
exports.env = EnvSchema.parse(process.env);
