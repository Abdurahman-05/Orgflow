import { LoginInput, RegisterInput } from "./auth.schema";
import bcrypt from "bcryptjs";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import prisma from "../../lib/prisma";
import { AppError } from "../../utils/AppError";
import { v4 as uuidv4 } from "uuid";
import { emailService } from "./email.service";

export async function registerUser(input: RegisterInput) {
  const { email, password, name } = input;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError("User already exists", 409); // <-- Replaced
  }

  const passwordHash = await bcrypt.hash(password, 10);

  // WHY: We use a transaction to ensure both user and token are created, or neither.
  const user = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email,
        name,
        passwordHash,
        isActive: false, // Explicitly set to false until verified
      },
    });

    // WHY: Generate a secure random token for email verification.
    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    await tx.verificationToken.create({
      data: {
        userId: newUser.id,
        token,
        expiresAt,
      },
    });

    // WHY: Send the verification email using the EmailService.
    // In a production app, this might be better handled by a background worker/queue.
    await emailService.sendVerificationEmail(email, token);

    return newUser;
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

  // WHY: Prevent unverified users from logging in as per requirements.
  if (!user.emailVerifiedAt) {
    throw new AppError("Please verify your email before logging in", 403);
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

/**
 * WHY: Verifies the email token and marks the user as verified.
 * This logic ensures the token is valid, not expired, and not already used.
 */
export async function verifyEmail(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!verificationToken) {
    throw new AppError("Invalid verification token", 400);
  }

  if (verificationToken.isUsed) {
    throw new AppError("Token has already been used", 400);
  }

  if (verificationToken.expiresAt < new Date()) {
    throw new AppError("Token has expired", 400);
  }

  // WHY: Update both the user and the token in a transaction.
  await prisma.$transaction([
    prisma.user.update({
      where: { id: verificationToken.userId },
      data: {
        emailVerifiedAt: new Date(),
        isActive: true,
      },
    }),
    prisma.verificationToken.update({
      where: { id: verificationToken.id },
      data: { isUsed: true },
    }),
  ]);

  return { message: "Email verified successfully" };
}
