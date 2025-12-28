import { Router } from "express";
import healthRoutes from "./modules/health/health.routes";
import authRoutes from "./modules/auth/auth.routes";
import organizationRoutes from "./modules/organization/organization.routes";


const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/organizations", organizationRoutes);
export default router;
