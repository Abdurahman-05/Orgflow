import { LoginInput, RegisterInput } from "./auth.schema";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";

export async function registerUser(input: RegisterInput) {
  const { email, password, name } = input;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User already exists", 409); // <-- Replaced
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
}

export async function loginUser(input: LoginInput) {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.passwordHash) {
    throw new AppError("Invalid email or password", 401); // <-- Replaced
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401); // <-- Replaced
  }

  const payload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  return { accessToken, refreshToken };
}

export async function refreshUserToken(refreshToken: string) {
  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded || typeof decoded === "string") {
    throw new AppError("Invalid refresh token", 401); // <-- Replaced
  }

  // Check if user still exists
  const user = await prisma.user.findUnique({
    where: { id: (decoded as any).userId },
  });

  if (!user) {
    throw new AppError("User not found", 404); // <-- Replaced
  }

  const payload = { userId: user.id, email: user.email };
  const accessToken = signAccessToken(payload);

  return { accessToken };
}
