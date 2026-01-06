import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { NotificationItem } from "./NotificationItem"

const MOCK_NOTIFICATIONS = [
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
]

export function NotificationBell() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <Button variant="ghost" size="sm" className="text-xs h-auto p-0 hover:bg-transparent text-primary">
            Mark all read
          </Button>
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {MOCK_NOTIFICATIONS.map((n) => (
            <NotificationItem key={n.id} notification={n} />
          ))}
        </div>
        <div className="border-t p-2 text-center">
          <Button variant="ghost" size="sm" className="w-full text-xs h-8">
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
