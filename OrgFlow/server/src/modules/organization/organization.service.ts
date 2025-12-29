import prisma from "../../lib/prisma";
import {
  CreateOrganizationInput,
  InviteMemberInput,
  AcceptInviteInput,
  UpdateMemberRoleInput
} from "./organization.schema";
import { AppError } from "../../utils/AppError";
import crypto from "crypto";
import { OrgRole } from "../../generated/prisma/enums";

export async function createOrganization(input: CreateOrganizationInput, ownerId: string) {
  const { name, slug } = input;

  const existingOrg = await prisma.organization.findUnique({
    where: { slug },
  });

  if (existingOrg) {
    throw new AppError("Organization with this slug already exists", 400);
  }

  const organization = await prisma.organization.create({
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

export async function getUserOrganizations(userId: string) {
  return prisma.organization.findMany({
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

export async function getOrganizationById(id: string, userId: string) {
  const organization = await prisma.organization.findUnique({
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
    throw new AppError("Organization not found", 404);
  }

  const isMember = organization.members.some(m => m.userId === userId);
  if (!isMember) {
    throw new AppError("Access denied", 403);
  }

  return organization;
}

export async function updateOrganization(id: string, userId: string, data: { name?: string }) {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: id,
      },
    },
  });

  if (!membership || (membership.role !== "OWNER" && membership.role !== "ADMIN")) {
    throw new AppError("You don't have permission to update this organization", 403);
  }

  return prisma.organization.update({
    where: { id },
    data,
  });
}

export async function deleteOrganization(id: string, userId: string) {
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId: id,
      },
    },
  });

  if (!membership || membership.role !== "OWNER") {
    throw new AppError("Only the owner can delete the organization", 403);
  }

  // Use transaction to ensure deletions are atomic
  return prisma.$transaction([
    prisma.organizationMember.deleteMany({ where: { organizationId: id } }),
    prisma.organization.delete({ where: { id } }),
  ]);
}
//additional

export async function inviteMember(organizationId: string, userId: string, input: InviteMemberInput) {
  const { email, role } = input;

  // Check if caller has permission
  const callerMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!callerMembership || (callerMembership.role !== "OWNER" && callerMembership.role !== "ADMIN")) {
    throw new AppError("You don't have permission to invite members", 403);
  }

  // Check if already a member
  const existingMember = await prisma.organizationMember.findFirst({
    where: {
      organizationId,
      user: { email },
    },
  });

  if (existingMember) {
    throw new AppError("User is already a member", 400);
  }

  // Create or update invite
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  return prisma.organizationInvite.upsert({
    where: {
      email_organizationId: {
        email,
        organizationId,
      },
    },
    update: {
      role: role as OrgRole,
      token,
      expiresAt,
    },
    create: {
      email,
      organizationId,
      role: role as OrgRole,
      token,
      expiresAt,
    },
  });
}

export async function acceptInvite(userId: string, token: string) {
  const invite = await prisma.organizationInvite.findUnique({
    where: { token },
    include: { organization: true },
  });

  if (!invite) {
    throw new AppError("Invalid or expired invitation", 404);
  }

  if (invite.expiresAt < new Date()) {
    throw new AppError("Invitation has expired", 400);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.email !== invite.email) {
    throw new AppError("This invitation was not sent to your email address", 403);
  }

  return prisma.$transaction(async (tx) => {
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

export async function listOrganizationMembers(organizationId: string, userId: string) {
  // Check if caller is a member
  const membership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!membership) {
    throw new AppError("Access denied", 403);
  }

  return prisma.organizationMember.findMany({
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

export async function updateMemberRole(organizationId: string, userId: string, targetUserId: string, role: OrgRole) {
  // Check if caller has permission
  const callerMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!callerMembership || (callerMembership.role !== "OWNER" && callerMembership.role !== "ADMIN")) {
    throw new AppError("You don't have permission to update member roles", 403);
  }

  if (targetUserId === userId) {
    throw new AppError("You cannot change your own role", 400);
  }

  const targetMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: targetUserId,
        organizationId,
      },
    },
  });

  if (!targetMembership) {
    throw new AppError("Member not found", 404);
  }

  if (targetMembership.role === "OWNER" && callerMembership.role !== "OWNER") {
    throw new AppError("Only the owner can change another owner's role", 403);
  }

  return prisma.organizationMember.update({
    where: {
      userId_organizationId: {
        userId: targetUserId,
        organizationId,
      },
    },
    data: { role },
  });
}

export async function removeMember(organizationId: string, userId: string, targetUserId: string) {
  // Check if caller has permission
  const callerMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!callerMembership) {
    throw new AppError("Access denied", 403);
  }

  const targetMembership = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId: targetUserId,
        organizationId,
      },
    },
  });

  if (!targetMembership) {
    throw new AppError("Member not found", 404);
  }

  // Permission logic:
  // 1. User can remove themselves (unless they are the only owner? for now just allow)
  // 2. Admin/Owner can remove others
  // 3. Admin cannot remove Owner

  if (userId !== targetUserId) {
    if (callerMembership.role !== "OWNER" && callerMembership.role !== "ADMIN") {
      throw new AppError("You don't have permission to remove members", 403);
    }
    if (targetMembership.role === "OWNER" && callerMembership.role !== "OWNER") {
      throw new AppError("Only the owner can remove another owner", 403);
    }
  } else {
    // Only owner can't leave if they are the only owner? 
    // For simplicity, just check if they are owner and if they are the last member
    if (targetMembership.role === "OWNER") {
      const ownerCount = await prisma.organizationMember.count({
        where: { organizationId, role: "OWNER" }
      });
      if (ownerCount <= 1) {
        throw new AppError("You are the only owner. You must transfer ownership or delete the organization.", 400);
      }
    }
  }

  return prisma.organizationMember.delete({
    where: {
      userId_organizationId: {
        userId: targetUserId,
        organizationId,
      },
    },
  });
}

