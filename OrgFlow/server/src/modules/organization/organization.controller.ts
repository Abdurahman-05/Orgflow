import { Response, NextFunction } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import {
  createOrganization,
  getUserOrganizations,
  getOrganizationById,
  updateOrganization,
  deleteOrganization
} from "./organization.service";
import { createOrganizationSchema, updateOrganizationSchema } from "./organization.schema";
import { AppError } from "../../utils/AppError";

export async function createOrganizationHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const input = createOrganizationSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const organization = await createOrganization(input, userId);
    res.status(201).json(organization);
  } catch (error) {
    next(error);
  }
}

export async function getMyOrganizationsHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const organizations = await getUserOrganizations(userId);
    res.status(200).json(organizations);
  } catch (error) {
    next(error);
  }
}

export async function getOrganizationHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { organizationId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const organization = await getOrganizationById(organizationId, userId);
    res.status(200).json(organization);
  } catch (error) {
    next(error);
  }
}

export async function updateOrganizationHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { organizationId } = req.params;
    const input = updateOrganizationSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const organization = await updateOrganization(organizationId, userId, input);
    res.status(200).json(organization);
  } catch (error) {
    next(error);
  }
}

export async function deleteOrganizationHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { organizationId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    await deleteOrganization(organizationId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

