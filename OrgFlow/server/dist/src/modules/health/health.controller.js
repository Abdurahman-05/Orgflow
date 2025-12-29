"use strict";
// import type { Request, Response } from "express";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthCheck = void 0;
const health_service_1 = require("./health.service");
const healthCheck = async (req, res) => {
    try {
        const data = await (0, health_service_1.healthService)();
        res.status(200).json(data);
    }
    catch (error) {
        res.status(500).json({
            status: "error",
            message: "Health check failed",
        });
    }
};
exports.healthCheck = healthCheck;
