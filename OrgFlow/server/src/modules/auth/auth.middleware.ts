import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/jwt";

export interface AuthRequest extends Request {
  user?: any;
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
     res.status(401).json({ message: "Unauthorized" });
     return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyAccessToken(token);

  if (!decoded) {
     res.status(401).json({ message: "Invalid token" });
     return
  }

  (req as AuthRequest).user = decoded;
  next();
}
