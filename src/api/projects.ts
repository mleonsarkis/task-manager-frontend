import { api } from "./client";
import type { Project } from "../types";

export function listProjects() {
  return api<Project[]>("/projects");
}

export function createProject(body: { name: string; description?: string }) {
  return api<Project>("/projects", { method: "POST", body: JSON.stringify(body) });
}

export function updateProject(id: string, body: { name: string; description?: string }) {
  return api<Project>(`/projects/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export function deleteProject(id: string) {
  return api<void>(`/projects/${id}`, { method: "DELETE" });
}
