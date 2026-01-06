import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Mail, MoreHorizontal } from "lucide-react"

const TEAM_MEMBERS = [
  {
    name: "Alice Johnson",
    role: "Product Manager",
    status: "Active",
    email: "alice@example.com",
    image: "/alice-in-wonderland.png",
  },
  {
    name: "Bob Smith",
    role: "Frontend Developer",
    status: "In Meeting",
    email: "bob@example.com",
    image: "/bob-portrait.png",
  },
  {
    name: "Charlie Davis",
    role: "UI Designer",
    status: "Active",
    email: "charlie@example.com",
    image: "/abstract-figure-charlie.png",
  },
  {
    name: "David Chen",
    role: "Backend Engineer",
    status: "Away",
    email: "david@example.com",
    image: "/thoughtful-person.png",
  },
]

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground text-sm">Manage your team members and roles.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM_MEMBERS.map((member, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.image || "/placeholder.svg"} />
                  <AvatarFallback>{member.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-sm font-semibold">{member.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Status</span>
                <Badge
                  variant={member.status === "Active" ? "default" : "secondary"}
                  className="h-5 px-1.5 py-0 text-[10px]"
                >
                  {member.status}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium">{member.email}</span>
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                <Mail className="mr-2 h-3 w-3" />
                Message
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
