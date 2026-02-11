import { useState } from "react";

const DEFAULT_TASK = {
  title: "",
  description: "",
  status: "todo",
  dueDate: "",
};

export default function TaskForm({ onCreate, loading }) {
  const [task, setTask] = useState(DEFAULT_TASK);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onCreate(task);
    setTask(DEFAULT_TASK);
  };

  const update = (key, value) => setTask((prev) => ({ ...prev, [key]: value }));

  return (
    <form className="card task-form" onSubmit={handleSubmit}>
      <div className="section-head">
        <p className="eyebrow">Planner</p>
        <h3>Add Task</h3>
      </div>
      <input
        id="new-task-title"
        placeholder="Task title"
        value={task.title}
        onChange={(event) => update("title", event.target.value)}
        required
      />
      <textarea
        placeholder="Brief description"
        value={task.description}
        onChange={(event) => update("description", event.target.value)}
        rows={4}
      />
      <div className="form-row">
        <select value={task.status} onChange={(event) => update("status", event.target.value)}>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          type="date"
          value={task.dueDate}
          onChange={(event) => update("dueDate", event.target.value)}
        />
      </div>
      <button type="submit" disabled={loading}>{loading ? "Saving..." : "Add Task"}</button>
    </form>
  );
}
