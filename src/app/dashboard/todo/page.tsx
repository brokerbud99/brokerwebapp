"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Circle, Plus, Calendar, User } from "lucide-react"

const dummyTodos = [
  {
    id: 1,
    title: "Follow up with John Smith",
    description: "Discuss loan pre-approval requirements",
    priority: "High",
    dueDate: "2025-01-15",
    assignee: "You",
    completed: false,
  },
  {
    id: 2,
    title: "Review Sarah's documents",
    description: "Check income verification and credit score",
    priority: "Medium",
    dueDate: "2025-01-16",
    assignee: "You",
    completed: false,
  },
  {
    id: 3,
    title: "Submit application for Michael",
    description: "Complete final submission to lender",
    priority: "High",
    dueDate: "2025-01-14",
    assignee: "You",
    completed: true,
  },
  {
    id: 4,
    title: "Schedule property valuation",
    description: "Arrange valuation for 123 Main St",
    priority: "Low",
    dueDate: "2025-01-18",
    assignee: "You",
    completed: false,
  },
]

export default function TodoPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">To Do</h1>
          <p className="text-gray-600 mt-1">Manage your tasks and activities</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">12</p>
              <p className="text-gray-600">Total Tasks</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-orange-600 mb-2">9</p>
              <p className="text-gray-600">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-green-600 mb-2">3</p>
              <p className="text-gray-600">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Todo List */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Tasks</h3>
          <div className="space-y-3">
            {dummyTodos.map((todo) => (
              <div
                key={todo.id}
                className={`border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors ${
                  todo.completed ? "bg-gray-50" : "bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  {todo.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h4
                      className={`font-semibold mb-1 ${
                        todo.completed ? "text-gray-500 line-through" : "text-gray-900"
                      }`}
                    >
                      {todo.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">{todo.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span
                        className={`px-2 py-1 rounded-full font-medium ${
                          todo.priority === "High"
                            ? "bg-red-100 text-red-700"
                            : todo.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {todo.priority}
                      </span>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-3 w-3 mr-1" />
                        {todo.dueDate}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="h-3 w-3 mr-1" />
                        {todo.assignee}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
