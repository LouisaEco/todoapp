import { useState } from "react";
import {
  validateTask,
  isPastDate,
  getTodayDate,
} from "../utils/validation";
import { getErrorMessage } from "../utils/errors";

export default function TaskItem({ task, setTasks, handleDelete, onAlert }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [priority, setPriority] = useState(task.priority || "Low");
  const [isLoading, setIsLoading] = useState(false);

  async function toggleComplete() {
    setIsLoading(true);

    const updated = { ...task, completed: !task.completed };

    try {
      const res = await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update task");
      }

      setTasks((old) =>
        old.map((t) => (t.id === task.id ? updated : t))
      );

      onAlert(
        updated.completed ? "Task marked as complete!" : "Task marked as incomplete!",
        "success"
      );
    } catch (err) {
      console.error("Error updating task:", err);
      const errorMessage = getErrorMessage(err);
      onAlert(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }

  async function saveEdit() {
    const updatedTask = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
    };

    const validation = validateTask(updatedTask);
    if (!validation.valid) {
      onAlert(validation.errors.join(" "), "error");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update task");
      }

      setTasks((old) =>
        old.map((t) => (t.id === task.id ? updatedTask : t))
      );

      setIsEditing(false);
      onAlert("Task updated successfully!", "success");
    } catch (err) {
      console.error("Error saving edit:", err);
      const errorMessage = getErrorMessage(err);
      onAlert(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  }

  function handleCancel() {
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate || "");
    setPriority(task.priority || "Low");
    setIsEditing(false);
  }

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      {isEditing ? (
        <div className="edit-area">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isLoading}
            maxLength="200"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            maxLength="2000"
          />

          <div className="row">
            <input
              type="date"
              value={dueDate}
              min={getTodayDate()}
              onChange={(e) => setDueDate(e.target.value)}
              disabled={isLoading}
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isLoading}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <button onClick={saveEdit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </button>
          <button onClick={handleCancel} disabled={isLoading}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="view-area">
          <div>
            <h3 style={{ textDecoration: task.completed ? "line-through" : "none" }}>
              {task.title}
            </h3>
            <p>{task.description}</p>
            <p>
              <b>Due:</b> {task.dueDate || "N/A"}
            </p>
            <p>
              <b>Priority:</b> {task.priority}
            </p>
          </div>

          <div className="actions">
            <button onClick={toggleComplete} disabled={isLoading}>
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => setIsEditing(true)} disabled={isLoading}>
              Edit
            </button>
            <button onClick={() => handleDelete(task.id)} disabled={isLoading}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
