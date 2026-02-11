import { Task } from "../models/Task.js";
import { clearCache, getCache, setCache } from "../services/cache.js";

const taskKey = (userId) => `tasks:${userId}`;

export const getTasks = async (req, res) => {
  try {
    const key = taskKey(req.user._id);
    const cached = getCache(key);
    if (cached) {
      return res.json(cached);
    }

    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 });
    setCache(key, tasks, 20 * 1000);
    res.json(tasks);
  } catch {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description = "", status = "todo", dueDate = null } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      owner: req.user._id,
    });

    clearCache(taskKey(req.user._id));
    res.status(201).json(task);
  } catch {
    res.status(500).json({ message: "Failed to create task" });
  }
};

export const updateTask = async (req, res) => {
  try {
    const updates = (({ title, description, status, dueDate }) => ({
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(status !== undefined ? { status } : {}),
      ...(dueDate !== undefined ? { dueDate } : {}),
    }))(req.body);

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updates,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    clearCache(taskKey(req.user._id));
    res.json(task);
  } catch {
    res.status(500).json({ message: "Failed to update task" });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    clearCache(taskKey(req.user._id));
    res.json({ message: "Task deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete task" });
  }
};
