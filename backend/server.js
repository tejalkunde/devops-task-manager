import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let tasks = [
  {
    id: 1,
    title: "Learn GitHub Actions",
    completed: true
  },
  {
    id: 2,
    title: "Deploy application with Kubernetes",
    completed: false
  },
  {
    id: 3,
    title: "Configure Argo CD",
    completed: false
  }
];

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    message: "Backend is running"
  });
});

// Get all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// Add task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({
      message: "Task title is required"
    });
  }

  const newTask = {
    id: Date.now(),
    title: title.trim(),
    completed: false
  };

  tasks.push(newTask);

  res.status(201).json(newTask);
});

// Toggle task
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  task.completed = !task.completed;

  res.json(task);
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  const taskExists = tasks.some((task) => task.id === id);

  if (!taskExists) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  tasks = tasks.filter((task) => task.id !== id);

  res.json({
    message: "Task deleted successfully"
  });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});