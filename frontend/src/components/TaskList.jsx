import { useState } from "react";

const toInputDate = (value) => (value ? new Date(value).toISOString().slice(0, 10) : "");

const buildDraft = (task) => ({
  title: task.title || "",
  description: task.description || "",
  status: task.status || "todo",
  dueDate: toInputDate(task.dueDate),
});

export default function TaskList({ tasks, onDelete, onStatusChange, onUpdate, loadingId }) {
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState(null);

  const startEdit = (task) => {
    setEditingId(task._id);
    setDraft(buildDraft(task));
  };

  const cancelEdit = () => {
    setEditingId("");
    setDraft(null);
  };

  const saveEdit = async (taskId) => {
    if (!draft?.title?.trim()) return;
    await onUpdate(taskId, {
      ...draft,
      dueDate: draft.dueDate || null,
    });
    cancelEdit();
  };

  if (!tasks.length) {
    return (
      <div className="card empty-state">
        <p className="eyebrow">Workspace</p>
        <h3>No tasks in this view</h3>
        <p>Create a task or change filters to see your work items.</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <article key={task._id} className={`card task-item task-card status-${task.status}`}>
          <div className="task-header">
            <div className="task-title-wrap">
              {editingId === task._id ? (
                <input
                  value={draft?.title || ""}
                  onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
                  placeholder="Task title"
                />
              ) : (
                <h4>{task.title}</h4>
              )}
              {editingId !== task._id && (
                <span className={`status-pill status-${task.status}`}>
                  {task.status === "in-progress" ? "In Progress" : task.status === "todo" ? "To Do" : "Done"}
                </span>
              )}
            </div>

            <select
              value={editingId === task._id ? draft?.status || "todo" : task.status}
              onChange={(event) =>
                editingId === task._id
                  ? setDraft((prev) => ({ ...prev, status: event.target.value }))
                  : onStatusChange(task, event.target.value)
              }
              disabled={loadingId === task._id}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          {editingId === task._id ? (
            <textarea
              value={draft?.description || ""}
              onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Description"
              rows={3}
            />
          ) : (
            task.description && <p className="task-description">{task.description}</p>
          )}

          <div className="task-footer">
            <div className="task-meta">
              {editingId === task._id ? (
                <small>
                  Due:{" "}
                  <input
                    type="date"
                    value={draft?.dueDate || ""}
                    onChange={(event) => setDraft((prev) => ({ ...prev, dueDate: event.target.value }))}
                  />
                </small>
              ) : (
                <small>
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"} | Updated:{" "}
                  {new Date(task.updatedAt || task.createdAt).toLocaleDateString()}
                </small>
              )}
            </div>

            <div className="task-actions">
              {editingId === task._id ? (
                <>
                  <button onClick={() => saveEdit(task._id)} disabled={loadingId === task._id} type="button">
                    {loadingId === task._id ? "Saving..." : "Save"}
                  </button>
                  <button className="btn-muted" onClick={cancelEdit} type="button">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-muted" onClick={() => startEdit(task)} type="button">
                    Edit
                  </button>
                  <button className="btn-danger" onClick={() => onDelete(task._id)} disabled={loadingId === task._id}>
                    {loadingId === task._id ? "..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
