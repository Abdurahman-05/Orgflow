// import type { Request, Response } from "express";

// export const healthController = {
//   check: (req: Request, res: Response) => {
//     res.json({ status: "ok", uptime: process.uptime() });
//   }
// };

import { Request, Response } from "express";
import { healthService } from "./health.service";

export const healthCheck = async (req: Request, res: Response) => {
  try {
    const data = await healthService();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Health check failed",
    });
  }
};
