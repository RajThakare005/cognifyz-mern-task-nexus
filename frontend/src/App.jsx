import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import {
  addTask,
  authRequest,
  changeTaskStatus,
  getExternalJoke,
  getTasks,
  removeTask,
  updateTask,
} from "./api";
import AuthForm from "./components/AuthForm";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function AuthPage({ mode, setMode, onAuth, loading, error, session }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (session) navigate("/dashboard", { replace: true });
  }, [session, navigate]);

  return (
    <main className="container auth-shell">
      <section className="hero-card">
        <p className="eyebrow">Project Workspace</p>
        <h1>MERN Task Nexus</h1>
        <p>Build, track, edit and deliver internship work with a modern flow.</p>
      </section>

      <section className="card form-card">
        <p className="eyebrow">Access</p>
        {error && <p className="error">{error}</p>}
        <AuthForm mode={mode} onSubmit={onAuth} loading={loading} />
        <button className="text-button" onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
        </button>
      </section>
    </main>
  );
}

function Dashboard({ session, logout, error, tasks, createTask, deleteTask, changeStatus, saveTask, loadingId }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("updated");
  const focusNewTask = () => document.getElementById("new-task-title")?.focus();
  const handleLogout = () => {
    logout();
    navigate("/logged-out", { replace: true });
  };

  useEffect(() => {
    if (!session) navigate("/login", { replace: true });
  }, [session, navigate]);

  if (!session) return null;

  const doneCount = tasks.filter((task) => task.status === "done").length;
  const progressCount = tasks.filter((task) => task.status === "in-progress").length;
  const todoCount = tasks.filter((task) => task.status === "todo").length;
  const completion = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
  const filteredTasks = tasks
    .filter((task) => (filter === "all" ? true : task.status === filter))
    .filter((task) => {
      const haystack = `${task.title} ${task.description || ""}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === "updated") return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      if (sortBy === "due") return new Date(a.dueDate || "9999-12-31") - new Date(b.dueDate || "9999-12-31");
      return (a.title || "").localeCompare(b.title || "");
    });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA" || event.target.tagName === "SELECT") {
        return;
      }
      if (event.key === "/") {
        event.preventDefault();
        document.getElementById("task-search")?.focus();
      }
      if (event.key.toLowerCase() === "n") {
        document.getElementById("new-task-title")?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main className="container">
      <header className="topbar">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>MERN Task Nexus</h1>
          <p className="subtle">Welcome, {session.user.name}</p>
          <div className="badge-row">
            <span className="mini-badge">Build</span>
            <span className="mini-badge">Collaborate</span>
            <span className="mini-badge">Ship</span>
          </div>
        </div>
        <div className="actions">
          <button className="btn-ghost" onClick={focusNewTask}>New Task</button>
          <button onClick={() => navigate("/external")}>External API</button>
          <button className="btn-muted" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <section className="stats-grid">
        <article className="stat-card">
          <p>Total</p>
          <h3>{tasks.length}</h3>
        </article>
        <article className="stat-card">
          <p>To Do</p>
          <h3>{todoCount}</h3>
        </article>
        <article className="stat-card">
          <p>In Progress</p>
          <h3>{progressCount}</h3>
        </article>
        <article className="stat-card">
          <p>Done</p>
          <h3>{doneCount}</h3>
        </article>
      </section>
      <section className="card workspace-bar">
        <div className="progress-wrap">
          <p className="subtle">Completion</p>
          <strong>{completion}%</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${completion}%` }} />
        </div>
        <div className="filter-row">
          <button className={filter === "all" ? "chip chip-active" : "chip"} onClick={() => setFilter("all")} type="button">
            All ({tasks.length})
          </button>
          <button className={filter === "todo" ? "chip chip-active" : "chip"} onClick={() => setFilter("todo")} type="button">
            To Do ({todoCount})
          </button>
          <button
            className={filter === "in-progress" ? "chip chip-active" : "chip"}
            onClick={() => setFilter("in-progress")}
            type="button"
          >
            In Progress ({progressCount})
          </button>
          <button className={filter === "done" ? "chip chip-active" : "chip"} onClick={() => setFilter("done")} type="button">
            Done ({doneCount})
          </button>
        </div>
        <div className="toolbar-row">
          <input
            id="task-search"
            placeholder="Search tasks... (press /)"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="updated">Sort: Recently Updated</option>
            <option value="due">Sort: Due Date</option>
            <option value="title">Sort: Title</option>
          </select>
        </div>
        <p className="shortcut-hint">Shortcuts: <kbd>/</kbd> search, <kbd>N</kbd> new task</p>
      </section>

      {error && <p className="error">{error}</p>}

      <section className="dashboard-grid">
        <TaskForm onCreate={createTask} loading={false} />
        <TaskList
          tasks={filteredTasks}
          onDelete={deleteTask}
          onStatusChange={changeStatus}
          onUpdate={saveTask}
          loadingId={loadingId}
        />
      </section>
    </main>
  );
}

function ExternalPage({ session }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [joke, setJoke] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session) navigate("/login", { replace: true });
  }, [session, navigate]);

  const loadJoke = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getExternalJoke();
      setJoke(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header className="topbar">
        <div>
          <p className="eyebrow">Integration Lab</p>
          <h1>External API Demo</h1>
        </div>
        <button className="btn-muted" onClick={() => navigate("/dashboard")}>Back</button>
      </header>
      <div className="card feature-card">
        <p className="eyebrow">Playground</p>
        <h3>Live External Data</h3>
        <button onClick={loadJoke} disabled={loading}>{loading ? "Loading..." : "Fetch Joke"}</button>
        {error && <p className="error">{error}</p>}
        {joke && (
          <p>
            <strong>[{joke.source}]</strong> {joke.data.setup} - {joke.data.punchline}
          </p>
        )}
      </div>
    </main>
  );
}

function LoggedOutPage() {
  const navigate = useNavigate();

  return (
    <main className="container">
      <section className="card form-card">
        <p className="eyebrow">Session</p>
        <h2>You are logged out</h2>
        <p className="subtle">Sign in again to continue managing your workspace.</p>
        <button onClick={() => navigate("/login", { replace: true })}>Go to Login</button>
      </section>
    </main>
  );
}

export default function App() {
  const [mode, setMode] = useState("login");
  const [authLoading, setAuthLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [error, setError] = useState("");
  const [tasks, setTasks] = useState([]);
  const [session, setSession] = useState(() => {
    const raw = localStorage.getItem("session");
    return raw ? JSON.parse(raw) : null;
  });

  const token = useMemo(() => session?.token || "", [session]);

  useEffect(() => {
    let rafId = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const tick = () => {
      current.x += (target.x - current.x) * 0.08;
      current.y += (target.y - current.y) * 0.08;
      document.documentElement.style.setProperty("--mx", current.x.toFixed(4));
      document.documentElement.style.setProperty("--my", current.y.toFixed(4));
      rafId = window.requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      target.x = (event.clientX - cx) / cx;
      target.y = (event.clientY - cy) / cy;
    };

    rafId = window.requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.cancelAnimationFrame(rafId);
    };
  }, []);

  const syncSession = (next) => {
    setSession(next);
    if (next) localStorage.setItem("session", JSON.stringify(next));
    else localStorage.removeItem("session");
  };

  useEffect(() => {
    if (!token) return;
    getTasks(token)
      .then(setTasks)
      .catch((e) => setError(e.message));
  }, [token]);

  const handleAuth = async (payload) => {
    setError("");
    setAuthLoading(true);
    try {
      const result = await authRequest(mode, payload);
      syncSession(result);
    } catch (e) {
      setError(e.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const createTask = async (task) => {
    try {
      const created = await addTask(token, task);
      setTasks((prev) => [created, ...prev]);
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteTask = async (taskId) => {
    setActionLoadingId(taskId);
    try {
      await removeTask(token, taskId);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (e) {
      setError(e.message);
    } finally {
      setActionLoadingId("");
    }
  };

  const changeStatus = async (task, status) => {
    setActionLoadingId(task._id);
    try {
      const updated = await changeTaskStatus(token, task._id, status);
      setTasks((prev) => prev.map((item) => (item._id === task._id ? updated : item)));
    } catch (e) {
      setError(e.message);
    } finally {
      setActionLoadingId("");
    }
  };

  const saveTask = async (taskId, updates) => {
    setActionLoadingId(taskId);
    try {
      const updated = await updateTask(token, taskId, updates);
      setTasks((prev) => prev.map((item) => (item._id === taskId ? updated : item)));
    } catch (e) {
      setError(e.message);
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <>
      <div className="ambient-layer layer-a" aria-hidden="true" />
      <div className="ambient-layer layer-b" aria-hidden="true" />
      <div className="ambient-layer layer-c" aria-hidden="true" />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={session ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="/login"
          element={
            <AuthPage
              mode={mode}
              setMode={setMode}
              onAuth={handleAuth}
              loading={authLoading}
              error={error}
              session={session}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            <Dashboard
              session={session}
              logout={() => syncSession(null)}
              error={error}
              tasks={tasks}
              createTask={createTask}
              deleteTask={deleteTask}
              changeStatus={changeStatus}
              saveTask={saveTask}
              loadingId={actionLoadingId}
            />
          }
        />
        <Route path="/external" element={<ExternalPage session={session} />} />
        <Route path="/logged-out" element={<LoggedOutPage />} />
      </Routes>
    </>
  );
}
