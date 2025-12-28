import prisma from "../../lib/prisma";
import { CreateOrganizationInput } from "./organization.schema";
import { AppError } from "../../utils/AppError";

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

