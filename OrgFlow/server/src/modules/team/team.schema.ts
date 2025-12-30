import { z } from "zod";

export const createTeamSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(255).optional(),
});

export const updateTeamSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().max(255).optional(),
});

export const addTeamMemberSchema = z.object({
  userId: z.cuid(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
export type UpdateTeamInput = z.infer<typeof updateTeamSchema>;
export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
