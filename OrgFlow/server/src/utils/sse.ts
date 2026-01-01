import { Response } from "express";
import { NotificationUpdate } from "../modules/notifications/notification.schema";

const userNotificationClients = new Map<string, Set<Response>>();

function setSSEHeaders(res: Response) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
}

function send(res: Response, message: any) {
  res.write(`data: ${JSON.stringify(message)}\n\n`);
}

export function addUserNotificationClient(userId: string, res: Response) {
  setSSEHeaders(res);

  if (!userNotificationClients.has(userId)) {
    userNotificationClients.set(userId, new Set());
  }

  const clients = userNotificationClients.get(userId)!;
  clients.add(res);
   
  // Send a heartbeat to keep connection alive
  send(res, { type: "heartbeat", timestamp: new Date() });

  res.on("close", () => {
    clients.delete(res);
    if (clients.size === 0) {
      userNotificationClients.delete(userId);
    }
  });
}

export function broadcastNotification(update: NotificationUpdate) {
  const clients = userNotificationClients.get(update.userId);
  if (clients) {
    clients.forEach((client) => {
      send(client, update);
    });
  }
}

export function getClientCounts() {
  const counts: Record<string, number> = {};
  userNotificationClients.forEach((clients, userId) => {
    counts[userId] = clients.size;
  });
  return counts;
}
