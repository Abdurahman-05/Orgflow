import { Response, NextFunction } from "express";
import { AuthRequest } from "../auth/auth.middleware";
import {
  createTeam,
  getTeamsInOrganization,
  getTeamById,
  updateTeam,
  deleteTeam,
  addMemberToTeam,
  listTeamMembers,
  removeMemberFromTeam
} from "./team.service";
import {
  createTeamSchema,
  updateTeamSchema,
  addTeamMemberSchema
} from "./team.schema";
import { AppError } from "../../utils/AppError";

export async function createTeamHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { orgId } = req.params;
    const input = createTeamSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const team = await createTeam(orgId, userId, input);
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
}

export async function getTeamsInOrganizationHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { orgId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const teams = await getTeamsInOrganization(orgId, userId);
    res.status(200).json(teams);
  } catch (error) {
    next(error);
  }
}

export async function getTeamHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { teamId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const team = await getTeamById(teamId, userId);
    res.status(200).json(team);
  } catch (error) {
    next(error);
  }
}

export async function updateTeamHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { teamId } = req.params;
    const input = updateTeamSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const team = await updateTeam(teamId, userId, input);
    res.status(200).json(team);
  } catch (error) {
    next(error);
  }
}

export async function deleteTeamHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { teamId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    await deleteTeam(teamId, userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function addTeamMemberHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { teamId } = req.params;
    const { userId: targetUserId } = addTeamMemberSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const membership = await addMemberToTeam(teamId, userId, targetUserId);
    res.status(201).json(membership);
  } catch (error) {
    next(error);
  }
}

export async function listTeamMembersHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { teamId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    const members = await listTeamMembers(teamId, userId);
    res.status(200).json(members);
  } catch (error) {
    next(error);
  }
}

export async function removeTeamMemberHandler(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { teamId, userId: targetUserId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      throw new AppError("Authentication required", 401);
    }

    await removeMemberFromTeam(teamId, userId, targetUserId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
