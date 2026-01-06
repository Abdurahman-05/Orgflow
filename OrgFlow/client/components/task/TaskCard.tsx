import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Calendar, MessageSquare, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface TaskCardProps {
  task: {
    id: string
    title: string
    status: string
    priority: "Low" | "Medium" | "High"
    assignees: { name: string; image?: string }[]
    dueDate: string
    comments: number
    attachments: number
  }
}

export function TaskCard({ task }: TaskCardProps) {
  const priorityColors = {
    Low: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    Medium: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    High: "bg-red-100 text-red-700 hover:bg-red-100",
  }

  return (
    <Link href={`/tasks/${task.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
          <Badge variant="outline" className="font-medium text-xs">
            {task.status}
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <h3 className="font-semibold text-sm mb-3 line-clamp-2">{task.title}</h3>
          <div className="flex items-center gap-3">
            <Badge className={`text-[10px] uppercase font-bold px-1.5 py-0 ${priorityColors[task.priority]}`}>
              {task.priority}
            </Badge>
            <div className="flex items-center text-muted-foreground text-xs">
              <Calendar className="mr-1 h-3 w-3" />
              {task.dueDate}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <div className="flex -space-x-2">
            {task.assignees.map((user, i) => (
              <Avatar key={i} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={user.image || "/placeholder.svg"} />
                <AvatarFallback className="text-[10px]">{user.name[0]}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            <span className="flex items-center">
              <MessageSquare className="mr-1 h-3 w-3" />
              {task.comments}
            </span>
            <span className="flex items-center">
              <Paperclip className="mr-1 h-3 w-3" />
              {task.attachments}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
