import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values
  let statusCode = 500;
  let message = "Internal Server Error";

  console.error(err);

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = err.flatten().fieldErrors as any;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      message = "Resource already exists";
    } else if (err.code === "P2025") {
      statusCode = 404;
      message = "Resource not found";
    } else {
      statusCode = 400;
      message = "Database error";
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
