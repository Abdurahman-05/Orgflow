"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const AppError_1 = require("../utils/AppError");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const errorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = 500;
    let message = "Internal Server Error";
    console.error(err);
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    else if (err instanceof zod_1.ZodError) {
        statusCode = 400;
        message = err.flatten().fieldErrors;
    }
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            statusCode = 409;
            message = "Resource already exists";
        }
        else if (err.code === "P2025") {
            statusCode = 404;
            message = "Resource not found";
        }
        else {
            statusCode = 400;
            message = "Database error";
        }
    }
    res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.errorHandler = errorHandler;
