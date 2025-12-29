import { Router } from "express";
import healthRoutes from "./modules/health/health.routes";
import authRoutes from "./modules/auth/auth.routes";
import organizationRoutes from "./modules/organization/organization.routes";
import { acceptInviteHandler } from "./modules/organization/organization.controller";
import { authenticate } from "./modules/auth/auth.middleware";


const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
router.post("/organization-invites/:token/accept", authenticate, acceptInviteHandler);
export default router;
