import type { ApiError } from "../types";

const BASE = import.meta.env.VITE_API_BASE_URL as string;

async function parseError(res: Response): Promise<ApiError> {
  try {
    return (await res.json()) as ApiError;
  } catch {
    return {
      timestamp: new Date().toISOString(),
      code: "HTTP_ERROR",
      message: `HTTP ${res.status}`,
      fieldErrors: [],
    };
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    ...init,
  });

  if (!res.ok) {
    throw await parseError(res);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
