"use client"

import { useState, useEffect } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { CalendarIcon, Clock, Edit, MoreHorizontal, Plus, Trash2, Loader2, RefreshCw } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

// Define task priority types and colors
type Priority = "low" | "medium" | "high"

const priorityColors = {
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
}

// Define task interface
interface Task {
  _id: string
  title: string
  description: string
  priority: Priority
  status: string
  deadline?: Date
  createdAt: Date
  user: string
}

// Define column interface
interface Column {
  id: string
  title: string
  tasks: Task[]
}

export default function TasksPage() {
  const { data: session } = useSession()
  const userId = session?.user?.id

  const [isLoading, setIsLoading] = useState(true)
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ])
  
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    deadline: undefined,
  })
  
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [taskToDelete, setTaskToDelete] = useState<{ taskId: string; columnId: string } | null>(null)
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [editDatePickerOpen, setEditDatePickerOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (userId) {
      fetchTasks()
    }
  }, [userId])

  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/tasks")
      
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      
      const tasks = await response.json()
      
      const todoTasks = tasks.filter((task: Task) => task.status === "todo")
      const inProgressTasks = tasks.filter((task: Task) => task.status === "in-progress")
      const doneTasks = tasks.filter((task: Task) => task.status === "done")
      
      setColumns([
        { id: "todo", title: "To Do", tasks: todoTasks },
        { id: "in-progress", title: "In Progress", tasks: inProgressTasks },
        { id: "done", title: "Done", tasks: doneTasks },
      ])
    } catch (error) {
      console.error("Error fetching tasks:", error)
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Sort tasks by deadline
  const sortTasksByDeadline = (tasks: Task[]) => {
    return [...tasks].sort((a, b) => {
      // Tasks without deadlines go to the bottom
      if (!a.deadline && !b.deadline) return 0
      if (!a.deadline) return 1
      if (!b.deadline) return -1

      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    })
  }

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    const sourceColumn = columns.find((col) => col.id === source.droppableId)
    const destColumn = columns.find((col) => col.id === destination.droppableId)

    if (!sourceColumn || !destColumn) return

    const newColumns = [...columns]
    const sourceColIndex = newColumns.findIndex((col) => col.id === source.droppableId)
    const destColIndex = newColumns.findIndex((col) => col.id === destination.droppableId)

    if (source.droppableId === destination.droppableId) {
      const newTasks = Array.from(sourceColumn.tasks)
      const [movedTask] = newTasks.splice(source.index, 1)
      newTasks.splice(destination.index, 0, movedTask)

      newColumns[sourceColIndex] = {
        ...sourceColumn,
        tasks: newTasks,
      }
      
      setColumns(newColumns)
    } else {
      const sourceTasks = Array.from(sourceColumn.tasks)
      
      const taskToMove = sourceColumn.tasks.find(task => task._id === draggableId);
      
      if (!taskToMove) {
        console.error("Task not found:", draggableId);
        return;
      }
      
      const [movedTask] = sourceTasks.splice(source.index, 1)
      const destTasks = Array.from(destColumn.tasks)
      
      try {
        setActionLoading(true);
        console.log("Updating task status:", taskToMove._id, "to", destination.droppableId);
        
        const response = await fetch(`/api/tasks/${taskToMove._id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: destination.droppableId,
          }),
        })
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error("Server response:", errorData);
          throw new Error("Failed to update task status: " + (errorData.error || response.statusText))
        }
        
        const updatedTask = { ...movedTask, status: destination.droppableId }
        destTasks.splice(destination.index, 0, updatedTask)

        newColumns[sourceColIndex] = {
          ...sourceColumn,
          tasks: sourceTasks,
        }

        newColumns[destColIndex] = {
          ...destColumn,
          tasks: destTasks,
        }
        
        setColumns(newColumns)

        toast({
          title: "Task moved",
          description: "Your task has been moved successfully.",
        })
      } catch (error) {
        console.error("Error updating task status:", error)
        toast({
          title: "Error",
          description: "Failed to update task status. Please try again.",
          variant: "destructive",
        })
        fetchTasks()
      } finally {
        setActionLoading(false);
      }
    }
  }

  const handleAddTask = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add tasks.",
        variant: "destructive",
      })
      return
    }

    if (!newTask.title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your task.",
        variant: "destructive",
      })
      return
    }

    try {
      setActionLoading(true)
      
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description || "",
          priority: newTask.priority || "medium",
          status: newTask.status || "todo",
          deadline: newTask.deadline,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to create task")
      }
      
      const createdTask = await response.json()
      
      const newColumns = columns.map((column) => {
        if (column.id === createdTask.status) {
          return {
            ...column,
            tasks: [...column.tasks, createdTask],
          }
        }
        return column
      })
      
      setColumns(newColumns)
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        status: "todo",
        deadline: undefined,
      })
      setIsAddDialogOpen(false)
      setDatePickerOpen(false)

      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditTask = async () => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please sign in to edit tasks.",
        variant: "destructive",
      })
      return
    }

    if (!editingTask || !editingTask.title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your task.",
        variant: "destructive",
      })
      return
    }

    try {
      setActionLoading(true)
      
      const response = await fetch(`/api/tasks/${editingTask._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editingTask.title,
          description: editingTask.description,
          priority: editingTask.priority,
          deadline: editingTask.deadline,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to update task")
      }
      
      const updatedTask = await response.json()
      
      const newColumns = columns.map((column) => {
        return {
          ...column,
          tasks: column.tasks.map((task) => {
            if (task._id === updatedTask._id) {
              return updatedTask
            }
            return task
          }),
        }
      })
      
      setColumns(newColumns)
      setEditingTask(null)
      setIsEditDialogOpen(false)
      setEditDatePickerOpen(false)

      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteTask = async () => {
    if (!userId || !taskToDelete) return

    try {
      setActionLoading(true)
      
      const { taskId, columnId } = taskToDelete
      
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete task")
      }
      
      const newColumns = columns.map((column) => {
        if (column.id === columnId) {
          return {
            ...column,
            tasks: column.tasks.filter((task) => task._id !== taskId),
          }
        }
        return column
      })
      
      setColumns(newColumns)
      setTaskToDelete(null)
      setIsDeleteDialogOpen(false)

      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(false)
    }
  }

  const openEditDialog = (task: Task) => {
    setEditingTask({ ...task })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (taskId: string, columnId: string) => {
    setTaskToDelete({ taskId, columnId })
    setIsDeleteDialogOpen(true)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setNewTask({ ...newTask, deadline: date })
    setDatePickerOpen(false)
  }

  const handleEditDateSelect = (date: Date | undefined) => {
    if (editingTask) {
      setEditingTask({ ...editingTask, deadline: date })
    }
    setEditDatePickerOpen(false)
  }

  const handleMoveTask = async (taskId: string, currentColumnId: string, targetColumnId: string) => {
    if (currentColumnId === targetColumnId || actionLoading) return;

    try {
      const sourceColumn = columns.find((col) => col.id === currentColumnId);
      if (!sourceColumn) {
        console.error("Source column not found:", currentColumnId);
        return;
      }
      
      const taskToMove = sourceColumn.tasks.find(task => task._id === taskId);
      if (!taskToMove) {
        console.error("Task not found:", taskId);
        return;
      }

      setActionLoading(true);
      
      const sourceColIndex = columns.findIndex((col) => col.id === currentColumnId);
      const destColIndex = columns.findIndex((col) => col.id === targetColumnId);
      
      if (sourceColIndex === -1 || destColIndex === -1) {
        throw new Error("Column not found");
      }
      
      const newColumns = [...columns];
      
      const sourceTasks = Array.from(newColumns[sourceColIndex].tasks);
      const taskIndex = sourceTasks.findIndex(t => t._id === taskId);
      const [movedTask] = sourceTasks.splice(taskIndex, 1);
      
      // Add to destination column
      const destTasks = Array.from(newColumns[destColIndex].tasks);
      const updatedTask = { ...movedTask, status: targetColumnId };
      destTasks.push(updatedTask);
      
      // Update columns
      newColumns[sourceColIndex] = {
        ...newColumns[sourceColIndex],
        tasks: sourceTasks,
      };
      
      newColumns[destColIndex] = {
        ...newColumns[destColIndex],
        tasks: destTasks,
      };
      
      setColumns(newColumns);
      
      // Now perform the actual API call
      console.log("Updating task status:", taskId, "to", targetColumnId);
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: targetColumnId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData);
        throw new Error("Failed to update task status: " + (errorData.error || response.statusText));
      }
      
      toast({
        title: "Task moved",
        description: "Task moved to " + columns.find(col => col.id === targetColumnId)?.title,
      });
    } catch (error) {
      console.error("Error moving task:", error);
      toast({
        title: "Error",
        description: "Failed to move task. Please try again.",
        variant: "destructive",
      });
      // Revert by refreshing the tasks
      fetchTasks();
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        <span className="ml-2 text-lg">Loading tasks...</span>
      </div>
    )
  }

  return (
    <section className="mb-6 px-2 md:px-0">
      <div className="w-full space-y-6 md:mb-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <h3 className="text-lg font-bold md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-600">Task Manager</h3>
          <div className="h-px flex-grow bg-gradient-to-r from-emerald-500/50 to-transparent"></div>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold dark:text-white">Task Board</h2>
              <p className="text-muted-foreground">Manage your tasks and track your progress</p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={fetchTasks} 
                disabled={isLoading || actionLoading}
                title="Refresh tasks"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
              </Button>
              <Dialog
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                  if (open) {
                    setIsAddDialogOpen(true);
                  } else {
                    setIsAddDialogOpen(false);
                    requestAnimationFrame(() => {
                      setNewTask({
                        title: "",
                        description: "",
                        priority: "medium",
                        status: "todo",
                        deadline: undefined,
                      });
                      setDatePickerOpen(false);
                    });
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>Create a new task to add to your board.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newTask.title || ""}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        placeholder="Task title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newTask.description || ""}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        placeholder="Task description"
                        rows={3}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newTask.priority || "medium"}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="deadline">Deadline (Optional)</Label>
                      <div className="relative">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                          onClick={() => setDatePickerOpen(!datePickerOpen)}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newTask.deadline ? format(new Date(newTask.deadline), "PPP") : "Pick a date"}
                        </Button>
                        {datePickerOpen && (
                          <div className="absolute z-50 mt-2 bg-background border rounded-md shadow-md">
                            <Calendar mode="single" selected={newTask.deadline} onSelect={handleDateSelect} initialFocus />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Column</Label>
                      <select
                        id="status"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={newTask.status || "todo"}
                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                      >
                        {columns.map((column) => (
                          <option key={column.id} value={column.id}>
                            {column.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      onClick={handleAddTask} 
                      disabled={actionLoading}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    >
                      {actionLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Task"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {columns.map((column) => (
                <div key={column.id} className="flex flex-col">
                  <Card className="border border-white/10 bg-black/40 backdrop-blur-sm shadow-lg dark:border-white/10 dark:bg-black/40 dark:backdrop-blur-sm">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg dark:text-white">{column.title}</CardTitle>
                        <Badge variant="outline">{column.tasks.length}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-2">
                      <Droppable droppableId={column.id}>
                        {(provided: any) => (
                          <div 
                            {...provided.droppableProps} 
                            ref={provided.innerRef} 
                            className="min-h-[200px] space-y-2"
                          >
                            {sortTasksByDeadline(column.tasks).map((task, index) => (
                              <Draggable key={task._id} draggableId={task._id} index={index}>
                                {(provided: any) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`group bg-card border border-white/5 rounded-md p-3 shadow-sm dark:border-white/5 transition-all duration-200 hover:shadow-md ${actionLoading ? 'opacity-60' : 'opacity-100'}`}
                                  >
                                    <div className="flex justify-between items-start">
                                      <h3 className="font-medium dark:text-white">{task.title}</h3>
                                      <div className="flex items-center gap-1">
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background/80"
                                          onClick={() => openEditDialog(task)}
                                          title="Edit task"
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-background/80"
                                          onClick={() => openDeleteDialog(task._id, column.id)}
                                          title="Delete task"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                            <Button 
                                              variant="ghost" 
                                              size="icon" 
                                              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-background/80"
                                              title="Move task"
                                            >
                                              <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                            {column.id !== "todo" && (
                                              <DropdownMenuItem onClick={() => handleMoveTask(task._id, column.id, "todo")}>
                                                Move to To Do
                                              </DropdownMenuItem>
                                            )}
                                            
                                            {column.id !== "in-progress" && (
                                              <DropdownMenuItem onClick={() => handleMoveTask(task._id, column.id, "in-progress")}>
                                                Move to In Progress
                                              </DropdownMenuItem>
                                            )}
                                            
                                            {column.id !== "done" && (
                                              <DropdownMenuItem onClick={() => handleMoveTask(task._id, column.id, "done")}>
                                                Move to Done
                                              </DropdownMenuItem>
                                            )}
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                      </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                                    <div className="flex justify-between items-center mt-3">
                                      <Badge className={priorityColors[task.priority as Priority]}>
                                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                      </Badge>
                                      {task.deadline && (
                                        <div className="flex items-center text-xs text-muted-foreground">
                                          <Clock className="h-3 w-3 mr-1" />
                                          {format(new Date(task.deadline), "MMM d")}
                                        </div>
                                      )}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 italic">
                                      {new Date(task.createdAt).toLocaleDateString()}
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </DragDropContext>

          {/* Edit Task Dialog */}
          <Dialog
            open={isEditDialogOpen}
            onOpenChange={(open) => {
              if (open) {
                setIsEditDialogOpen(true);
              } else {
                setIsEditDialogOpen(false);
                requestAnimationFrame(() => {
                  setEditingTask(null);
                  setEditDatePickerOpen(false);
                });
              }
            }}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>Make changes to your task.</DialogDescription>
              </DialogHeader>
              {editingTask && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={editingTask.title}
                      onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editingTask.description}
                      onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-priority">Priority</Label>
                    <select
                      id="edit-priority"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={editingTask.priority}
                      onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Priority })}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-deadline">Deadline (Optional)</Label>
                    <div className="relative">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                        onClick={() => setEditDatePickerOpen(!editDatePickerOpen)}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {editingTask.deadline ? format(new Date(editingTask.deadline), "PPP") : "Pick a date"}
                      </Button>
                      {editDatePickerOpen && (
                        <div className="absolute z-50 mt-2 bg-background border rounded-md shadow-md">
                          <Calendar
                            mode="single"
                            selected={editingTask.deadline}
                            onSelect={handleEditDateSelect}
                            initialFocus
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button 
                  onClick={handleEditTask} 
                  disabled={actionLoading}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Task Dialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={(open) => {
              if (open) {
                setIsDeleteDialogOpen(true);
              } else {
                setIsDeleteDialogOpen(false);
                requestAnimationFrame(() => {
                  setTaskToDelete(null);
                });
              }
            }}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your task.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteTask}
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {actionLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </section>
  )
}
