"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organization_controller_1 = require("./organization.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
/**
 * @swagger
 * /api/organizations:
 *   post:
 *     summary: Create a new organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization created
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", organization_controller_1.createOrganizationHandler);
/**
 * @swagger
 * /api/organizations:
 *   get:
 *     summary: Get all organizations where user is a member
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get("/", organization_controller_1.getMyOrganizationsHandler);
/**
 * @swagger
 * /api/organizations/{organizationId}:
 *   get:
 *     summary: Get organization details
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *       403:
 *         description: Access denied
 *       404:
 *         description: Not found
 */
router.get("/:organizationId", organization_controller_1.getOrganizationHandler);
/**
 * @swagger
 * /api/organizations/{organizationId}:
 *   patch:
 *     summary: Update organization name
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       403:
 *         description: Permission denied
 */
router.patch("/:organizationId", organization_controller_1.updateOrganizationHandler);
/**
 * @swagger
 * /api/organizations/{organizationId}:
 *   delete:
 *     summary: Delete organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Deleted
 *       403:
 *         description: Only owner can delete
 */
router.delete("/:organizationId", organization_controller_1.deleteOrganizationHandler);
/**
 * @swagger
 * /api/organizations/{organizationId}/invite:
 *   post:
 *     summary: Invite a new member
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MEMBER]
 *     responses:
 *       201:
 *         description: Invitation sent
 *       403:
 *         description: Permission denied
 */
router.post("/:organizationId/invite", organization_controller_1.inviteMemberHandler);
/**
 * @swagger
 * /api/organizations/invites/{token}/accept:
 *   post:
 *     summary: Accept an invitation
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invitation accepted
 *       404:
 *         description: Invalid or expired token
 */
router.post("/invites/:token/accept", organization_controller_1.acceptInviteHandler);
/**
 * @swagger
 * /api/organizations/{organizationId}/members:
 *   get:
 *     summary: List all members of an organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/:organizationId/members", organization_controller_1.listMembersHandler);
/**
 * @swagger
 * /api/organizations/{organizationId}/members/{userId}:
 *   patch:
 *     summary: Change member role
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [ADMIN, MEMBER]
 *     responses:
 *       200:
 *         description: Role updated
 *       403:
 *         description: Permission denied
 */
router.patch("/:organizationId/members/:userId", organization_controller_1.updateMemberRoleHandler);
/**
 * @swagger
 * /api/organizations/{organizationId}/members/{userId}:
 *   delete:
 *     summary: Remove member from organization
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: organizationId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Member removed
 *       403:
 *         description: Permission denied
 */
router.delete("/:organizationId/members/:userId", organization_controller_1.removeMemberHandler);
exports.default = router;
