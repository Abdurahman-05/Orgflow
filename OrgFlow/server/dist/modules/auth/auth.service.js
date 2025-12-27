"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const prisma_1 = require("../../lib/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt_1 = require("./jwt");
exports.AuthService = {
    async login(email, password, ip, userAgent) {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user || !user.passwordHash || !user.isActive)
            throw new Error("Account not activated");
        if (!(await bcryptjs_1.default.compare(password, user.passwordHash)))
            throw new Error("Invalid credentials");
        if (user.isDisabled)
            throw new Error("Account disabled");
        // const permissions =
        //   user.roles.flatMap(r =>
        //     r.role.permissions.map(p =>
        //       `${p.permission.action}.${p.permission.resource}`
        //     )
        //   ) ?? [];
        const accessToken = (0, jwt_1.signAccessToken)({
            id: user.id
        });
        // const refreshToken = signRefreshToken({ id: user.id });
        // const session = await SessionService.create(
        //   user.id,
        //   refreshToken,
        //   userAgent,
        //   ip
        // );
        // return { accessToken, refreshToken, sessionId: session.id };
        return { accessToken };
    },
    // async refresh(refreshToken: string) {
    //   const session = await SessionService.findValid(refreshToken);
    //   if (!session) throw new Error("Invalid or expired refresh token");
    //   const payload = (await import("jsonwebtoken")).verify(
    //     refreshToken,
    //     process.env.JWT_SECRET!
    //   ) as any;
    //   const newAccess = signAccessToken({ id: payload.id });
    //   const newRefresh = signRefreshToken({ id: payload.id });
    //   await SessionService.rotate(session.id, newRefresh);
    //   return { accessToken: newAccess, refreshToken: newRefresh };
    // },
    // async activateAccount(token: string, password: string) {
    //   const invite = await prisma.userActivationToken.findUnique({
    //     where: { token },
    //     include: { user: true }
    //   });
    //   if (!invite) throw new Error("Invalid invite token");
    //   if (invite.usedAt) throw new Error("Invite already used");
    //   if (invite.expiresAt < new Date()) throw new Error("Invite expired");
    //   const passwordHash = await bcrypt.hash(password, 10);
    //   await prisma.$transaction([
    //     prisma.user.update({
    //       where: { id: invite.userId },
    //       data: {
    //         passwordHash,
    //         isActive: true,
    //         emailVerifiedAt: new Date()
    //       }
    //     }),
    //     prisma.userActivationToken.update({
    //       where: { id: invite.id },
    //       data: { usedAt: new Date() }
    //     })
    //   ]);
    //   return { success: true };
    // }
};
