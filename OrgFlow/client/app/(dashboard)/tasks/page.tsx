import { TaskList } from "@/components/task/TaskList"
import { Button } from "@/components/ui/button"
import { Plus, Filter, LayoutGrid, List } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TasksPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground text-sm">Manage and track all your team's tasks.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 bg-transparent">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <div className="flex items-center border rounded-md p-1 h-9">
            <Button variant="secondary" size="icon" className="h-7 w-7 rounded-sm">
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm text-muted-foreground">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <TaskList />
    </div>
  )
}
