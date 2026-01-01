import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { CreateTaskInput, UpdateTaskInput } from "./task.schema";
import { createNotification } from "../notifications/notification.service";
import { NotificationType } from "../../generated/prisma/enums";


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

export async function createTask(organizationId: string, userId: string, data: CreateTaskInput) {
  await checkOrgRole(organizationId, userId, ["OWNER", "ADMIN"]);

  // If teamId is provided, verify it belongs to the organization
  if (data.teamId) {
    const team = await prisma.team.findUnique({
      where: { id: data.teamId },
    });
    if (!team || team.organizationId !== organizationId) {
      throw new AppError("Team not found in this organization", 404);
    }
  }

  const task = await prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      organizationId,
      assignedToTeamId: data.teamId,
      createdById: userId,
    },
  });

  return task;
}

export async function getOrgTasks(organizationId: string, userId: string) {
  await checkIsOrgMember(organizationId, userId);

  return prisma.task.findMany({
    where: { organizationId },
    orderBy: { createdAt: "desc" },
    include: {
      assignedUsers: {
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      },
      _count: {
        select: { comments: true, attachments: true }
      }
    }
  });
}

export async function getTaskById(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignedUsers: {
        include: {
          user: {
            select: { id: true, name: true, email: true }
          }
        }
      },
      comments: {
        include: {
          user: {
            select: { id: true, name: true }
          }
        }
      },
      attachments: true,
      _count: {
        select: { comments: true, attachments: true }
      }
    },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  await checkIsOrgMember(task.organizationId, userId);

  return task;
}

export async function updateTask(taskId: string, userId: string, data: UpdateTaskInput) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      assignedUsers: true
    }
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  // Check permissions
  const member = await prisma.organizationMember.findUnique({
    where: { userId_organizationId: { userId, organizationId: task.organizationId } }
  });

  if (!member) throw new AppError("Unauthorized", 403);

  const isOwnerOrAdmin = ["OWNER", "ADMIN"].includes(member.role);
  const isAssigned = task.assignedUsers.some(au => au.userId === userId);

  if (!isOwnerOrAdmin && !isAssigned) {
    throw new AppError("You don't have permission to update this task", 403);
  }

  // If teamId is being updated, verify it
  if (data.teamId) {
    const team = await prisma.team.findUnique({
      where: { id: data.teamId },
    });
    if (!team || team.organizationId !== task.organizationId) {
      throw new AppError("Team not found in this organization", 404);
    }
  }

  return prisma.task.update({
    where: { id: taskId },
    data: {
      ...data,
      dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
      assignedToTeamId: data.teamId
    },
  });
}

export async function deleteTask(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  await checkOrgRole(task.organizationId, userId, ["OWNER", "ADMIN"]);

  return prisma.task.delete({
    where: { id: taskId },
  });
}

export async function assignUserToTask(taskId: string, userId: string, targetUserId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  await checkOrgRole(task.organizationId, userId, ["OWNER", "ADMIN"]);

  // Check if target user is in the organization
  await checkIsOrgMember(task.organizationId, targetUserId);

  // If task belongs to a team, target user must be member of that team
  if (task.assignedToTeamId) {
    const teamMember = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId: task.assignedToTeamId, userId: targetUserId } }
    });
    if (!teamMember) {
      throw new AppError("User must be a member of the task's team", 400);
    }
  }

  const assignment = await prisma.taskAssignee.create({
    data: {
      taskId,
      userId: targetUserId,
    },
  });


 await createNotification({
    userId: targetUserId,
    organizationId: task.organizationId,
    type: NotificationType.TASK_ASSIGNED,
    entityId: task.id,
    message: `You have been assigned to task: ${task.title}`,
  });

  return assignment;
}

export async function listTaskAssignees(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  await checkIsOrgMember(task.organizationId, userId);

  return prisma.taskAssignee.findMany({
    where: { taskId },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });
}

export async function removeTaskAssignee(taskId: string, userId: string, targetUserId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  await checkOrgRole(task.organizationId, userId, ["OWNER", "ADMIN"]);

  const existingAssignee = await prisma.taskAssignee.findUnique({
    where: { taskId_userId: { taskId, userId: targetUserId } }
  });

  if (!existingAssignee) {
    throw new AppError("User is not assigned to this task", 404);
  }

  return prisma.taskAssignee.delete({
    where: { taskId_userId: { taskId, userId: targetUserId } }
  });
}
