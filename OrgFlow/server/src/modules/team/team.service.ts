import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { CreateTeamInput, UpdateTeamInput } from "./team.schema";



async function checkOrgRole(organizationId: string, userId: string, allowedRoles: string[]) {
  const member = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!member || !allowedRoles.includes(member.role)) {
    throw new AppError("You don't have permission to perform this action", 403);
  }
}

async function checkIsOrgMember(organizationId: string, userId: string) {
  const member = await prisma.organizationMember.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
  });

  if (!member) {
    throw new AppError("User is not a member of this organization", 403);
  }
  return member;
}

export async function createTeam(organizationId: string, userId: string, data: CreateTeamInput) {
  await checkOrgRole(organizationId, userId, ["OWNER", "ADMIN"]);

  return prisma.team.create({
    data: {
      ...data,
      organizationId,
    },
  });
}

export async function getTeamsInOrganization(organizationId: string, userId: string) {
  await checkIsOrgMember(organizationId, userId);

  return prisma.team.findMany({
    where: { organizationId },
    include: {
      _count: {
        select: { members: true },
      },
    },
  });
}

export async function getTeamById(teamId: string, userId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    include: {
      organization: true,
    },
  });

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  await checkIsOrgMember(team.organizationId, userId);

  return team;
}

export async function updateTeam(teamId: string, userId: string, data: UpdateTeamInput) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  await checkOrgRole(team.organizationId, userId, ["OWNER", "ADMIN"]);

  return prisma.team.update({
    where: { id: teamId },
    data,
  });
}

export async function deleteTeam(teamId: string, userId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  await checkOrgRole(team.organizationId, userId, ["OWNER", "ADMIN"]);

  return prisma.team.delete({
    where: { id: teamId },
  });
}

export async function addMemberToTeam(teamId: string, userId: string, targetUserId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  await checkOrgRole(team.organizationId, userId, ["OWNER", "ADMIN"]);

  // Check if target user is in the organization
  await checkIsOrgMember(team.organizationId, targetUserId);

  // Check if already in team
  const existingMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId: targetUserId,
      },
    },
  });

  if (existingMember) {
    throw new AppError("User is already a member of this team", 400);
  }

  return prisma.teamMember.create({
    data: {
      teamId,
      userId: targetUserId,
    },
  });
}

export async function listTeamMembers(teamId: string, userId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  await checkIsOrgMember(team.organizationId, userId);

  return prisma.teamMember.findMany({
    where: { teamId },
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

export async function removeMemberFromTeam(teamId: string, userId: string, targetUserId: string) {
  const team = await prisma.team.findUnique({
    where: { id: teamId },
  });

  if (!team) {
    throw new AppError("Team not found", 404);
  }

  await checkOrgRole(team.organizationId, userId, ["OWNER", "ADMIN"]);

  const existingMember = await prisma.teamMember.findUnique({
    where: {
      teamId_userId: {
        teamId,
        userId: targetUserId,
      },
    },
  });

  if (!existingMember) {
    throw new AppError("User is not a member of this team", 404);
  }

  return prisma.teamMember.delete({
    where: {
      teamId_userId: {
        teamId,
        userId: targetUserId,
      },
    },
  });
}
