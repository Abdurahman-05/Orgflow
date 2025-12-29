"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
exports.refreshUserToken = refreshUserToken;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("../../utils/jwt");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = require("../../utils/AppError");
async function registerUser(input) {
    const { email, password, name } = input;
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (existingUser) {
        throw new AppError_1.AppError("User already exists", 409); // <-- Replaced
    }
    const passwordHash = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            email,
            name,
            passwordHash,
        },
    });
    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}
async function loginUser(input) {
    const { email, password } = input;
    const user = await prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user || !user.passwordHash) {
        throw new AppError_1.AppError("Invalid email or password", 401); // <-- Replaced
    }
    const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!isPasswordValid) {
        throw new AppError_1.AppError("Invalid email or password", 401); // <-- Replaced
    }
    const payload = { userId: user.id, email: user.email };
    const accessToken = (0, jwt_1.signAccessToken)(payload);
    const refreshToken = (0, jwt_1.signRefreshToken)(payload);
    return { accessToken, refreshToken };
}
async function refreshUserToken(refreshToken) {
    const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
    if (!decoded || typeof decoded === "string") {
        throw new AppError_1.AppError("Invalid refresh token", 401); // <-- Replaced
    }
    // Check if user still exists
    const user = await prisma_1.default.user.findUnique({
        where: { id: decoded.userId },
    });
    if (!user) {
        throw new AppError_1.AppError("User not found", 404); // <-- Replaced
    }
    const payload = { userId: user.id, email: user.email };
    const accessToken = (0, jwt_1.signAccessToken)(payload);
    return { accessToken };
}
