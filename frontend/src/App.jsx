import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
import.meta.env.VITE_API_URL || "http://localhost:5000/api";


function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();

    if (!newTask.trim()) return;

    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: newTask
        })
      });

      const task = await response.json();

      setTasks((prev) => [...prev, task]);
      setNewTask("");
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  const toggleTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT"
      });

      const updatedTask = await response.json();

      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API_URL}/tasks/${id}`, {
        method: "DELETE"
      });

      setTasks((prev) =>
        prev.filter((task) => task.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  return (
    <div className="app">
      <div className="container">

        <header>
          <h1>DevOps Task Manager</h1>
          <p>
            CI/CD • Kubernetes • GHCR • Argo CD
          </p>
        </header>

        <form onSubmit={addTask} className="task-form">
          <input
            type="text"
            placeholder="Enter a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />

          <button type="submit">
            Add Task
          </button>
        </form>

        <section className="tasks">

          {loading ? (
            <p className="message">Loading tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="message">
              No tasks available.
            </p>
          ) : (
            tasks.map((task) => (
              <div
                className={`task ${
                  task.completed ? "completed" : ""
                }`}
                key={task.id}
              >

                <div
                  className="task-info"
                  onClick={() => toggleTask(task.id)}
                >
                  <span className="checkbox">
                    {task.completed ? "✓" : ""}
                  </span>

                  <span>{task.title}</span>
                </div>

                <button
                  className="delete"
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>

              </div>
            ))
          )}

        </section>

        <footer>
          <span>
            Total Tasks: {tasks.length}
          </span>

          <span>
            Completed: {
              tasks.filter((task) => task.completed).length
            }
          </span>
        </footer>

      </div>
    </div>
  );
}

export default App;