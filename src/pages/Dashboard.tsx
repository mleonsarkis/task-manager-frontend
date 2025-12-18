import { useEffect, useMemo, useState } from "react";
import type { ApiError, Project, Task, TaskStatus } from "../types";
import { createProject, deleteProject, listProjects, updateProject } from "../api/projects";
import { createTask, deleteTask, listTasks, updateTask } from "../api/tasks";

const statusOptions: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

function formatErr(err: unknown) {
  const e = err as ApiError;
  if (!e?.message) return "Unknown error";
  const fields = e.fieldErrors?.length
    ? " — " + e.fieldErrors.map((f) => `${f.field}: ${f.error}`).join(", ")
    : "";
  return `${e.code}: ${e.message}${fields}`;
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [filterStatus, setFilterStatus] = useState<TaskStatus | "ALL">("ALL");

  const [error, setError] = useState<string | null>(null);
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  async function refreshProjects(selectId?: string | null) {
    const data = await listProjects();
    setProjects(data);
    if (selectId !== undefined) setSelectedProjectId(selectId);
    else if (!selectedProjectId && data.length) setSelectedProjectId(data[0].id);
  }

  async function refreshTasks(pid: string) {
    const status = filterStatus === "ALL" ? undefined : filterStatus;
    const data = await listTasks(pid, status);
    setTasks(data);
  }

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        await refreshProjects();
      } catch (e) {
        setError(formatErr(e));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    (async () => {
      if (!selectedProjectId) return;
      try {
        setError(null);
        await refreshTasks(selectedProjectId);
      } catch (e) {
        setError(formatErr(e));
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProjectId, filterStatus]);

  async function onCreateProject() {
    const name = prompt("Project name:");
    if (!name) return;
    const description = prompt("Description (optional):") || undefined;
    try {
      setError(null);
      const created = await createProject({ name, description });
      await refreshProjects(created.id);
    } catch (e) {
      setError(formatErr(e));
    }
  }

  async function onRenameProject(p: Project) {
    const name = prompt("New project name:", p.name);
    if (!name) return;
    const description = prompt("Description (optional):", p.description ?? "") || undefined;
    try {
      setError(null);
      await updateProject(p.id, { name, description });
      await refreshProjects(p.id);
    } catch (e) {
      setError(formatErr(e));
    }
  }

  async function onDeleteProject(p: Project) {
    if (!confirm(`Delete project "${p.name}"? This will delete its tasks.`)) return;
    try {
      setError(null);
      await deleteProject(p.id);
      const nextId = projects.filter((x) => x.id !== p.id)[0]?.id ?? null;
      await refreshProjects(nextId);
      setTasks([]);
    } catch (e) {
      setError(formatErr(e));
    }
  }

  async function onCreateTask() {
    if (!selectedProjectId) return;
    const title = prompt("Task title:");
    if (!title) return;
    const status = (prompt("Status (TODO / IN_PROGRESS / DONE):", "TODO") || "TODO") as TaskStatus;
    const dueDate = prompt("Due date (yyyy-mm-dd) optional:", "") || null;
    const description = prompt("Description (optional):", "") || undefined;

    try {
      setError(null);
      await createTask(selectedProjectId, { title, status, dueDate, description });
      await refreshProjects(selectedProjectId);
      await refreshTasks(selectedProjectId);
    } catch (e) {
      setError(formatErr(e));
    }
  }

  async function onEditTask(t: Task) {
    if (!selectedProjectId) return;
    const title = prompt("Task title:", t.title);
    if (!title) return;
    const status = (prompt("Status (TODO / IN_PROGRESS / DONE):", t.status) || t.status) as TaskStatus;
    const dueDate = prompt("Due date (yyyy-mm-dd) optional:", t.dueDate ?? "") || null;
    const description = prompt("Description (optional):", t.description ?? "") || undefined;

    try {
      setError(null);
      await updateTask(selectedProjectId, t.id, { title, status, dueDate, description });
      await refreshProjects(selectedProjectId);
      await refreshTasks(selectedProjectId);
    } catch (e) {
      setError(formatErr(e));
    }
  }

  async function onDeleteTask(t: Task) {
    if (!selectedProjectId) return;
    if (!confirm(`Delete task "${t.title}"?`)) return;
    try {
      setError(null);
      await deleteTask(selectedProjectId, t.id);
      await refreshProjects(selectedProjectId);
      await refreshTasks(selectedProjectId);
    } catch (e) {
      setError(formatErr(e));
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "system-ui, sans-serif" }}>
      <aside style={{ width: 320, borderRight: "1px solid #ddd", padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Projects</h2>
          <button onClick={onCreateProject}>+ New</button>
        </div>

        <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 8 }}>
          {projects.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: 10,
                cursor: "pointer",
                background: p.id === selectedProjectId ? "#f5f5f5" : "white",
              }}
              onClick={() => setSelectedProjectId(p.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <strong style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.name}
                </strong>
                <span style={{ opacity: 0.7 }}>{p.taskCount}</span>
              </div>
              {p.description ? (
                <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p.description}
                </div>
              ) : null}
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={(e) => (e.stopPropagation(), onRenameProject(p))}>Edit</button>
                <button onClick={(e) => (e.stopPropagation(), onDeleteProject(p))}>Delete</button>
              </div>
            </div>
          ))}
          {!projects.length && <div style={{ opacity: 0.7 }}>No projects yet.</div>}
        </div>
      </aside>

      <main style={{ flex: 1, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h2 style={{ margin: 0 }}>Tasks</h2>
            <div style={{ opacity: 0.7, fontSize: 13 }}>
              {selectedProject ? `Project: ${selectedProject.name}` : "Select a project"}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              Status:
                          <select
                              value={filterStatus}
                              onChange={(e) => {
                                  const v = e.target.value;
                                  setFilterStatus(v === "ALL" ? "ALL" : (v as TaskStatus));
                              }}
                          >
                              <option value="ALL">ALL</option>
                              {statusOptions.map((s) => (
                                  <option key={s} value={s}>
                                      {s}
                                  </option>
                              ))}
                          </select>
            </label>

            <button onClick={onCreateTask} disabled={!selectedProjectId}>
              + New Task
            </button>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: 12, padding: 10, border: "1px solid #f2c2c2", background: "#fff1f1", borderRadius: 8 }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid #ddd" }}>
                <th style={{ padding: 8 }}>Title</th>
                <th style={{ padding: 8 }}>Status</th>
                <th style={{ padding: 8 }}>Due</th>
                <th style={{ padding: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((t) => (
                <tr key={t.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: 8 }}>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    {t.description ? <div style={{ fontSize: 12, opacity: 0.75 }}>{t.description}</div> : null}
                  </td>
                  <td style={{ padding: 8 }}>{t.status}</td>
                  <td style={{ padding: 8 }}>{t.dueDate ?? "-"}</td>
                  <td style={{ padding: 8 }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => onEditTask(t)}>Edit</button>
                      <button onClick={() => onDeleteTask(t)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {!tasks.length && (
                <tr>
                  <td style={{ padding: 12, opacity: 0.7 }} colSpan={4}>
                    {selectedProjectId ? "No tasks yet." : "Select a project to view tasks."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
