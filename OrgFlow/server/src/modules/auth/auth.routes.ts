import { Router } from "express";
import { loginHandler, refreshTokenHandler, registerHandler } from "./auth.controller";

const router = Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/refresh", refreshTokenHandler);

export default router;
