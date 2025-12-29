"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_routes_1 = __importDefault(require("./modules/health/health.routes"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const organization_routes_1 = __importDefault(require("./modules/organization/organization.routes"));
const organization_controller_1 = require("./modules/organization/organization.controller");
const auth_middleware_1 = require("./modules/auth/auth.middleware");
const router = (0, express_1.Router)();
router.use("/health", health_routes_1.default);
router.use("/auth", auth_routes_1.default);
router.use("/organizations", organization_routes_1.default);
router.post("/organization-invites/:token/accept", auth_middleware_1.authenticate, organization_controller_1.acceptInviteHandler);
exports.default = router;
