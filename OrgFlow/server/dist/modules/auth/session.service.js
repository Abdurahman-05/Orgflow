"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const prisma_1 = require("../../lib/prisma");
exports.SessionService = {
    async create(userId, refreshToken, userAgent, ip) {
        return prisma_1.prisma.session.create({
            data: {
                userId,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
                userAgent,
                ip,
                token: refreshToken
            },
        });
    },
    async findValid(refreshToken) {
        return prisma_1.prisma.session.findFirst({
            where: { token: refreshToken, revoked: false, expiresAt: { gt: new Date() } },
        });
    },
    async rotate(sessionId, newToken) {
        return prisma_1.prisma.session.update({
            where: { id: sessionId },
            data: {
                token: newToken,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            },
        });
    },
    async revoke(sessionId) {
        return prisma_1.prisma.session.update({
            where: { id: sessionId },
            data: { revoked: true },
        });
    },
};
