import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { NotificationItem } from "@/components/notification/NotificationItem"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

const NOTIFICATIONS = [
  {
    id: "1",
    user: { name: "Sarah Miller", image: "/diverse-group-smiling.png" },
    action: "mentioned you in",
    target: "Project Alpha",
    time: "2 mins ago",
    unread: true,
  },
  {
    id: "2",
    user: { name: "David Chen", image: "/thoughtful-person.png" },
    action: "assigned a new task to you:",
    target: "API Integration",
    time: "1 hour ago",
    unread: false,
  },
  {
    id: "3",
    user: { name: "Elena Rodriguez", image: "/portrait-elena.png" },
    action: "approved your changes in",
    target: "Design System",
    time: "5 hours ago",
    unread: false,
  },
]

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground text-sm">Stay updated with your team's activity.</p>
        </div>
        <Button variant="outline" size="sm">
          <Check className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {NOTIFICATIONS.map((n) => (
              <NotificationItem key={n.id} notification={n} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
