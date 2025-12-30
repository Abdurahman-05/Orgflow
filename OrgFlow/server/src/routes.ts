import { Router } from "express";
import healthRoutes from "./modules/health/health.routes";
import authRoutes from "./modules/auth/auth.routes";
import organizationRoutes from "./modules/organization/organization.routes";
import { orgTeamsRouter, teamRouter } from "./modules/team/team.routes";
import { taskCommentsRouter, commentRouter } from "./modules/comments/comment.route";
import { taskAttachmentsRouter, attachmentRouter } from "./modules/attachments/attachment.route";
import { orgTasksRouter, taskRouter } from "./modules/tasks/task.route";
import { acceptInviteHandler } from "./modules/organization/organization.controller";
import { authenticate } from "./modules/auth/auth.middleware";


const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.use("/organizations/:orgId/teams", orgTeamsRouter);
router.use("/organizations/:orgId/tasks", orgTasksRouter);
router.use("/teams", teamRouter);
router.use("/tasks/:taskId/comments", taskCommentsRouter);
router.use("/tasks/:taskId/attachments", taskAttachmentsRouter);
router.use("/tasks", taskRouter);
router.use("/comments", commentRouter);
router.use("/attachments", attachmentRouter);
router.post("/organization-invites/:token/accept", authenticate, acceptInviteHandler);
export default router;
