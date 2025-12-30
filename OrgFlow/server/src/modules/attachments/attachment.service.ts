import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { CreateAttachmentInput } from "./attachment.schema";

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

export async function uploadAttachment(taskId: string, userId: string, data: CreateAttachmentInput) {
  await getTaskAndCheckAccess(taskId, userId);

  return prisma.attachment.create({
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

export async function getTaskAttachments(taskId: string, userId: string) {
  await getTaskAndCheckAccess(taskId, userId);

  return prisma.attachment.findMany({
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

export async function deleteAttachment(attachmentId: string, userId: string) {
  const attachment = await prisma.attachment.findUnique({
    where: { id: attachmentId },
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

  if (!attachment) {
    throw new AppError("Attachment not found", 404);
  }

  const userMembership = attachment.task.organization.members[0];
  const isUploader = attachment.userId === userId;
  const isOrgAdminOrOwner = userMembership && (userMembership.role === "OWNER" || userMembership.role === "ADMIN");

  if (!isUploader && !isOrgAdminOrOwner) {
    throw new AppError("You don't have permission to delete this attachment", 403);
  }

  return prisma.attachment.delete({
    where: { id: attachmentId },
  });
}
