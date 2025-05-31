"use server";

import { connectToDB } from "@/lib/mongoose";
import Task from "@/lib/models/task.model";
import User from "@/lib/models/user.model";
import { revalidatePath } from "next/cache";

export async function createTask(
  userId: string,
  title: string,
  description: string,
  priority: string,
  status: string,
  deadline?: Date
) {
  try {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newTask = await Task.create({
      title,
      description,
      priority,
      status,
      deadline,
      user: userId,
    });

    revalidatePath("/tasks");
    return JSON.parse(JSON.stringify(newTask));
  } catch (error: any) {
    console.error("Error creating task:", error);
    throw new Error(`Failed to create task: ${error.message}`);
  }
}

export async function getUserTasks(userId: string) {
  try {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }


    const tasks = await Task.find({ user: userId }).sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(tasks));
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
}

export async function updateTask(
  taskId: string,
  userId: string,
  updateData: {
    title?: string;
    description?: string;
    priority?: string;
    status?: string;
    deadline?: Date | null;
  }
) {
  try {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.user.toString() !== userId) {
      throw new Error("Not authorized to update this task");
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { ...updateData },
      { new: true }
    );

    revalidatePath("/tasks");
    return JSON.parse(JSON.stringify(updatedTask));
  } catch (error: any) {
    console.error("Error updating task:", error);
    throw new Error(`Failed to update task: ${error.message}`);
  }
}

export async function deleteTask(taskId: string, userId: string) {
  try {
    await connectToDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }


    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.user.toString() !== userId) {
      throw new Error("Not authorized to delete this task");
    }


    await Task.findByIdAndDelete(taskId);

    revalidatePath("/tasks");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting task:", error);
    throw new Error(`Failed to delete task: ${error.message}`);
  }
}
