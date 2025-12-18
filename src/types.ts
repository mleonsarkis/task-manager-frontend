export type Project = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  taskCount: number;
};

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  dueDate?: string | null; // ISO date: yyyy-mm-dd
  createdAt: string;
  updatedAt: string;
};

export type ApiError = {
  timestamp: string;
  code: string;
  message: string;
  fieldErrors?: { field: string; error: string }[];
};
