"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrganizationHandler = createOrganizationHandler;
exports.getMyOrganizationsHandler = getMyOrganizationsHandler;
exports.getOrganizationHandler = getOrganizationHandler;
exports.updateOrganizationHandler = updateOrganizationHandler;
exports.deleteOrganizationHandler = deleteOrganizationHandler;
exports.inviteMemberHandler = inviteMemberHandler;
exports.acceptInviteHandler = acceptInviteHandler;
exports.listMembersHandler = listMembersHandler;
exports.updateMemberRoleHandler = updateMemberRoleHandler;
exports.removeMemberHandler = removeMemberHandler;
const organization_service_1 = require("./organization.service");
const organization_schema_1 = require("./organization.schema");
const AppError_1 = require("../../utils/AppError");
async function createOrganizationHandler(req, res, next) {
    try {
        const input = organization_schema_1.createOrganizationSchema.parse(req.body);
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        const organization = await (0, organization_service_1.createOrganization)(input, userId);
        res.status(201).json(organization);
    }
    catch (error) {
        next(error);
    }
}
async function getMyOrganizationsHandler(req, res, next) {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        const organizations = await (0, organization_service_1.getUserOrganizations)(userId);
        res.status(200).json(organizations);
    }
    catch (error) {
        next(error);
    }
}
async function getOrganizationHandler(req, res, next) {
    try {
        const { organizationId } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        const organization = await (0, organization_service_1.getOrganizationById)(organizationId, userId);
        res.status(200).json(organization);
    }
    catch (error) {
        next(error);
    }
}
async function updateOrganizationHandler(req, res, next) {
    try {
        const { organizationId } = req.params;
        const input = organization_schema_1.updateOrganizationSchema.parse(req.body);
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        const organization = await (0, organization_service_1.updateOrganization)(organizationId, userId, input);
        res.status(200).json(organization);
    }
    catch (error) {
        next(error);
    }
}
async function deleteOrganizationHandler(req, res, next) {
    try {
        const { organizationId } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        await (0, organization_service_1.deleteOrganization)(organizationId, userId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
async function inviteMemberHandler(req, res, next) {
    try {
        const { organizationId } = req.params;
        const input = organization_schema_1.inviteMemberSchema.parse(req.body);
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        const invite = await (0, organization_service_1.inviteMember)(organizationId, userId, input);
        res.status(201).json(invite);
    }
    catch (error) {
        next(error);
    }
}
async function acceptInviteHandler(req, res, next) {
    try {
        const { token } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        const membership = await (0, organization_service_1.acceptInvite)(userId, token);
        res.status(200).json(membership);
    }
    catch (error) {
        next(error);
    }
}
async function listMembersHandler(req, res, next) {
    try {
        const { organizationId } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        const members = await (0, organization_service_1.listOrganizationMembers)(organizationId, userId);
        res.status(200).json(members);
    }
    catch (error) {
        next(error);
    }
}
async function updateMemberRoleHandler(req, res, next) {
    try {
        const { organizationId, userId: targetUserId } = req.params;
        const { role } = organization_schema_1.updateMemberRoleSchema.parse(req.body);
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        const membership = await (0, organization_service_1.updateMemberRole)(organizationId, userId, targetUserId, role);
        res.status(200).json(membership);
    }
    catch (error) {
        next(error);
    }
}
async function removeMemberHandler(req, res, next) {
    try {
        const { organizationId, userId: targetUserId } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            throw new AppError_1.AppError("Authentication required", 401);
        }
        await (0, organization_service_1.removeMember)(organizationId, userId, targetUserId);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
}
