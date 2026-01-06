import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface NotificationItemProps {
  notification: {
    id: string
    user: { name: string; image?: string }
    action: string
    target: string
    time: string
    unread: boolean
  }
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer",
        notification.unread && "bg-primary/5",
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarImage src={notification.user.image || "/placeholder.svg"} />
        <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <p className="text-xs leading-none">
          <span className="font-semibold">{notification.user.name}</span>{" "}
          <span className="text-muted-foreground">{notification.action}</span>{" "}
          <span className="font-medium">{notification.target}</span>
        </p>
        <p className="text-[10px] text-muted-foreground">{notification.time}</p>
      </div>
      {notification.unread && <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1" />}
    </div>
  )
}
