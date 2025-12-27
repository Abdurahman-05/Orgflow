import { Request, Response, NextFunction } from "express";
import { loginUser, refreshUserToken, registerUser } from "./auth.service";
import { loginSchema, registerSchema, refreshTokenSchema } from "./auth.schema";

export async function registerHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body);
    const user = await registerUser(input);
    res.status(201).json(user);
  } catch (e: any) {
    next(e);
  }
}

export async function loginHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const { accessToken, refreshToken } = await loginUser(input);
    res.status(200).json({ accessToken, refreshToken });
  } catch (e: any) {
     next(e);
  }
}

export async function refreshTokenHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input = refreshTokenSchema.parse(req.body);
    const { accessToken } = await refreshUserToken(input.refreshToken);
    res.status(200).json({ accessToken });
  } catch (e: any) {
     next(e);
  }
}
