import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { CreateCommentInput, UpdateCommentInput } from "./comment.schema";

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

async function getTaskAndCheckAccess(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: { organization: true },
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  await checkIsOrgMember(task.organizationId, userId);
  return task;
}

export async function addComment(taskId: string, userId: string, data: CreateCommentInput) {
  const task = await getTaskAndCheckAccess(taskId, userId);

  return prisma.comment.create({
    data: {
      ...data,
      taskId,
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function getTaskComments(taskId: string, userId: string) {
  await getTaskAndCheckAccess(taskId, userId);

  return prisma.comment.findMany({
    where: { taskId },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function updateComment(commentId: string, userId: string, data: UpdateCommentInput) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      task: true
    }
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.userId !== userId) {
    throw new AppError("Only the author can update this comment", 403);
  }

  return prisma.comment.update({
    where: { id: commentId },
    data,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

export async function deleteComment(commentId: string, userId: string) {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
    include: {
      task: {
        include: {
          organization: {
            include: {
              members: {
                where: { userId }
              }
            }
          }
        }
      }
    }
  });

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  const userMembership = comment.task.organization.members[0];
  const isAuthor = comment.userId === userId;
  const isOrgAdminOrOwner = userMembership && (userMembership.role === "OWNER" || userMembership.role === "ADMIN");

  if (!isAuthor && !isOrgAdminOrOwner) {
    throw new AppError("You don't have permission to delete this comment", 403);
  }

  return prisma.comment.delete({
    where: { id: commentId },
  });
}
