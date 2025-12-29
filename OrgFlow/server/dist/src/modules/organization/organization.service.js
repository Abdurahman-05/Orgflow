"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganization = createOrganization;
exports.getUserOrganizations = getUserOrganizations;
exports.getOrganizationById = getOrganizationById;
exports.updateOrganization = updateOrganization;
exports.deleteOrganization = deleteOrganization;
exports.inviteMember = inviteMember;
exports.acceptInvite = acceptInvite;
exports.listOrganizationMembers = listOrganizationMembers;
exports.updateMemberRole = updateMemberRole;
exports.removeMember = removeMember;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = require("../../utils/AppError");
const crypto_1 = __importDefault(require("crypto"));
async function createOrganization(input, ownerId) {
    const { name, slug } = input;
    const existingOrg = await prisma_1.default.organization.findUnique({
        where: { slug },
    });
    if (existingOrg) {
        throw new AppError_1.AppError("Organization with this slug already exists", 400);
    }
    const organization = await prisma_1.default.organization.create({
        data: {
            name,
            slug,
            ownerId,
            members: {
                create: {
                    userId: ownerId,
                    role: "OWNER",
                },
            },
        },
        include: {
            members: true,
        },
    });
    return organization;
}
async function getUserOrganizations(userId) {
    return prisma_1.default.organization.findMany({
        where: {
            members: {
                some: {
                    userId,
                },
            },
        },
        include: {
            members: true,
        },
    });
}
async function getOrganizationById(id, userId) {
    const organization = await prisma_1.default.organization.findUnique({
        where: { id },
        include: {
            members: {
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        }
                    }
                }
            },
        },
    });
    if (!organization) {
        throw new AppError_1.AppError("Organization not found", 404);
    }
    const isMember = organization.members.some(m => m.userId === userId);
    if (!isMember) {
        throw new AppError_1.AppError("Access denied", 403);
    }
    return organization;
}
async function updateOrganization(id, userId, data) {
    const membership = await prisma_1.default.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId,
                organizationId: id,
            },
        },
    });
    if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
        throw new AppError_1.AppError("You don't have permission to update this organization", 403);
    }
    return prisma_1.default.organization.update({
        where: { id },
        data,
    });
}
async function deleteOrganization(id, userId) {
    const membership = await prisma_1.default.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId,
                organizationId: id,
            },
        },
    });
    if (!membership || membership.role !== "OWNER") {
        throw new AppError_1.AppError("Only the owner can delete the organization", 403);
    }
    // Use transaction to ensure deletions are atomic
    return prisma_1.default.$transaction([
        prisma_1.default.organizationMember.deleteMany({ where: { organizationId: id } }),
        prisma_1.default.organization.delete({ where: { id } }),
    ]);
}
//additional
async function inviteMember(organizationId, userId, input) {
    const { email, role } = input;
    // Check if caller has permission
    const callerMembership = await prisma_1.default.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId,
                organizationId,
            },
        },
    });
    if (!callerMembership || (callerMembership.role !== "OWNER" && callerMembership.role !== "ADMIN")) {
        throw new AppError_1.AppError("You don't have permission to invite members", 403);
    }
    // Check if already a member
    const existingMember = await prisma_1.default.organizationMember.findFirst({
        where: {
            organizationId,
            user: { email },
        },
    });
    if (existingMember) {
        throw new AppError_1.AppError("User is already a member", 400);
    }
    // Create or update invite
    const token = crypto_1.default.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    return prisma_1.default.organizationInvite.upsert({
        where: {
            email_organizationId: {
                email,
                organizationId,
            },
        },
        update: {
            role: role,
            token,
            expiresAt,
        },
        create: {
            email,
            organizationId,
            role: role,
            token,
            expiresAt,
        },
    });
}
async function acceptInvite(userId, token) {
    const invite = await prisma_1.default.organizationInvite.findUnique({
        where: { token },
        include: { organization: true },
    });
    if (!invite) {
        throw new AppError_1.AppError("Invalid or expired invitation", 404);
    }
    if (invite.expiresAt < new Date()) {
        throw new AppError_1.AppError("Invitation has expired", 400);
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user || user.email !== invite.email) {
        throw new AppError_1.AppError("This invitation was not sent to your email address", 403);
    }
    return prisma_1.default.$transaction(async (tx) => {
        const membership = await tx.organizationMember.create({
            data: {
                userId,
                organizationId: invite.organizationId,
                role: invite.role,
            },
        });
        await tx.organizationInvite.delete({
            where: { id: invite.id },
        });
        return membership;
    });
}
async function listOrganizationMembers(organizationId, userId) {
    // Check if caller is a member
    const membership = await prisma_1.default.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId,
                organizationId,
            },
        },
    });
    if (!membership) {
        throw new AppError_1.AppError("Access denied", 403);
    }
    return prisma_1.default.organizationMember.findMany({
        where: { organizationId },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                },
            },
        },
    });
}
async function updateMemberRole(organizationId, userId, targetUserId, role) {
    // Check if caller has permission
    const callerMembership = await prisma_1.default.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId,
                organizationId,
            },
        },
    });
    if (!callerMembership || (callerMembership.role !== "OWNER" && callerMembership.role !== "ADMIN")) {
        throw new AppError_1.AppError("You don't have permission to update member roles", 403);
    }
    if (targetUserId === userId) {
        throw new AppError_1.AppError("You cannot change your own role", 400);
    }
    const targetMembership = await prisma_1.default.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId: targetUserId,
                organizationId,
            },
        },
    });
    if (!targetMembership) {
        throw new AppError_1.AppError("Member not found", 404);
    }
    if (targetMembership.role === "OWNER" && callerMembership.role !== "OWNER") {
        throw new AppError_1.AppError("Only the owner can change another owner's role", 403);
    }
    return prisma_1.default.organizationMember.update({
        where: {
            userId_organizationId: {
                userId: targetUserId,
                organizationId,
            },
        },
        data: { role },
    });
}
async function removeMember(organizationId, userId, targetUserId) {
    // Check if caller has permission
    const callerMembership = await prisma_1.default.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId,
                organizationId,
            },
        },
    });
    if (!callerMembership) {
        throw new AppError_1.AppError("Access denied", 403);
    }
    const targetMembership = await prisma_1.default.organizationMember.findUnique({
        where: {
            userId_organizationId: {
                userId: targetUserId,
                organizationId,
            },
        },
    });
    if (!targetMembership) {
        throw new AppError_1.AppError("Member not found", 404);
    }
    // Permission logic:
    // 1. User can remove themselves (unless they are the only owner? for now just allow)
    // 2. Admin/Owner can remove others
    // 3. Admin cannot remove Owner
    if (userId !== targetUserId) {
        if (callerMembership.role !== "OWNER" && callerMembership.role !== "ADMIN") {
            throw new AppError_1.AppError("You don't have permission to remove members", 403);
        }
        if (targetMembership.role === "OWNER" && callerMembership.role !== "OWNER") {
            throw new AppError_1.AppError("Only the owner can remove another owner", 403);
        }
    }
    else {
        // Only owner can't leave if they are the only owner? 
        // For simplicity, just check if they are owner and if they are the last member
        if (targetMembership.role === "OWNER") {
            const ownerCount = await prisma_1.default.organizationMember.count({
                where: { organizationId, role: "OWNER" }
            });
            if (ownerCount <= 1) {
                throw new AppError_1.AppError("You are the only owner. You must transfer ownership or delete the organization.", 400);
            }
        }
    }
    return prisma_1.default.organizationMember.delete({
        where: {
            userId_organizationId: {
                userId: targetUserId,
                organizationId,
            },
        },
    });
}
