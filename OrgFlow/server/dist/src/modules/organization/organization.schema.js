"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMemberRoleSchema = exports.acceptInviteSchema = exports.inviteMemberSchema = exports.updateOrganizationSchema = exports.createOrganizationSchema = void 0;
const zod_1 = require("zod");
exports.createOrganizationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    slug: zod_1.z.string().min(1, "Slug is required").regex(/^[a-z0-z0-9-]+$/, "Slug must be alphanumeric and can contain hyphens"),
});
exports.updateOrganizationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).optional(),
});
exports.inviteMemberSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email address"),
    role: zod_1.z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
});
exports.acceptInviteSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, "Token is required"),
});
exports.updateMemberRoleSchema = zod_1.z.object({
    role: zod_1.z.enum(["ADMIN", "MEMBER"]),
});
