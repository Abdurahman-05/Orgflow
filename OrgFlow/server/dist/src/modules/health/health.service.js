"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const healthService = async () => {
    let databaseStatus = "connected";
    try {
        await prisma_1.default.$queryRaw `SELECT 1`;
    }
    catch {
        databaseStatus = "disconnected";
    }
    return {
        status: "ok",
        uptime: process.uptime(), // seconds
        database: databaseStatus,
        memory: {
            rss: process.memoryUsage().rss,
            heapTotal: process.memoryUsage().heapTotal,
            heapUsed: process.memoryUsage().heapUsed,
        },
        timestamp: new Date().toISOString(),
    };
};
exports.healthService = healthService;
