import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Calendar, User, Tag, Clock, Send } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"

export default async function TaskDetailPage({ params }: { params: { taskId: string } }) {
  const { taskId } = await params

  return (
    <div className="space-y-6">
      <Link
        href="/tasks"
        className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ChevronLeft className="mr-1 h-4 w-4" />
        Back to tasks
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">TASK-{taskId}</Badge>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">Medium</Badge>
              </div>
              <CardTitle className="text-2xl">Design System Implementation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>
                  We need to standardize our UI components across the entire platform. This includes updating buttons,
                  inputs, and navigation elements to follow the new brand guidelines.
                </p>
                <h4 className="text-foreground mt-4 mb-2 font-semibold">Requirements:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Audit existing components</li>
                  <li>Define color palette and typography in Tailwind config</li>
                  <li>Create base components using shadcn/ui</li>
                  <li>Document component usage and props</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
              <TabsTrigger
                value="details"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-2 font-semibold"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-2 font-semibold"
              >
                Comments
              </TabsTrigger>
              <TabsTrigger
                value="attachments"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-1 py-2 font-semibold"
              >
                Attachments
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="pt-4">
              <p className="text-sm text-muted-foreground">
                Additional technical specifications and context for this task go here.
              </p>
            </TabsContent>
            <TabsContent value="comments" className="pt-4 space-y-4">
              {[
                { user: "Alice", text: "I've started auditing the button variants.", time: "2 hours ago" },
                { user: "Bob", text: "Great, I'll focus on the typography scale today.", time: "1 hour ago" },
              ].map((comment, i) => (
                <div key={i} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{comment.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold">{comment.user}</span>
                      <span className="text-[10px] text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-xs">{comment.text}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-2 mt-4">
                <Input placeholder="Write a comment..." className="flex-1" />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="attachments" className="pt-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <p className="text-sm text-muted-foreground">No attachments yet. Drag and drop files here.</p>
                <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                  Upload File
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Properties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Status
                </span>
                <Badge>In Progress</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" /> Assignee
                </span>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">Alice</span>
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" /> Due Date
                </span>
                <span className="font-medium">Oct 24, 2025</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Label
                </span>
                <Badge variant="secondary">UI/UX</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
