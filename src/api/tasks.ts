import { api } from "./client";
import type { Task, TaskStatus } from "../types";

export function listTasks(projectId: string, status?: TaskStatus) {
  const q = status ? `?status=${status}` : "";
  return api<Task[]>(`/projects/${projectId}/tasks${q}`);
}

export function createTask(
  projectId: string,
  body: { title: string; description?: string; status?: TaskStatus; dueDate?: string | null }
) {
  return api<Task>(`/projects/${projectId}/tasks`, { method: "POST", body: JSON.stringify(body) });
}

export function updateTask(
  projectId: string,
  taskId: string,
  body: { title: string; description?: string; status?: TaskStatus; dueDate?: string | null }
) {
  return api<Task>(`/projects/${projectId}/tasks/${taskId}`, { method: "PUT", body: JSON.stringify(body) });
}

export function deleteTask(projectId: string, taskId: string) {
  return api<void>(`/projects/${projectId}/tasks/${taskId}`, { method: "DELETE" });
}
