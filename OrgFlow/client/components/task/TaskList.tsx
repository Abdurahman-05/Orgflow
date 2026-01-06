import { TaskCard } from "./TaskCard"

const MOCK_TASKS = [
  {
    id: "1",
    title: "Design System Implementation",
    status: "In Progress",
    priority: "High" as const,
    assignees: [
      { name: "Alice", image: "/alice-in-wonderland.png" },
      { name: "Bob", image: "/bob-portrait.png" },
    ],
    dueDate: "Oct 24",
    comments: 12,
    attachments: 5,
  },
  {
    id: "2",
    title: "Onboarding Flow Optimization",
    status: "Review",
    priority: "Medium" as const,
    assignees: [{ name: "Charlie", image: "/abstract-figure-charlie.png" }],
    dueDate: "Oct 26",
    comments: 8,
    attachments: 2,
  },
  {
    id: "3",
    title: "API Documentation Update",
    status: "To Do",
    priority: "Low" as const,
    assignees: [{ name: "Alice", image: "/alice-in-wonderland.png" }],
    dueDate: "Oct 30",
    comments: 4,
    attachments: 0,
  },
]

export function TaskList() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {MOCK_TASKS.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
