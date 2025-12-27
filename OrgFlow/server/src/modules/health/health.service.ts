import prisma from "../../lib/prisma";


export const healthService = async () => {
  let databaseStatus = "connected";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch {
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
