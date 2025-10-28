import { useState } from "react";

export default function TaskItem({ task, setTasks, handleDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [priority, setPriority] = useState(task.priority || "Low");

  // helper to check if a date is in the past
  function isPastDate(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    const chosen = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    chosen.setHours(0, 0, 0, 0);
    return chosen < today;
  }

  // toggle complete status and update in database
  async function toggleComplete() {
    let updated = { ...task, completed: !task.completed };

    try {
      await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });

      setTasks((old) =>
        old.map((t) => (t.id === task.id ? updated : t))
      );
    } catch (err) {
      console.log("Error updating task:", err);
    }
  }

  // save edited task (with past date validation)
  async function saveEdit() {
    if (title.trim() === "") {
      alert("Title cannot be empty!");
      return;
    }

    if (isPastDate(dueDate)) {
      alert("You cannot select a past date.");
      return;
    }

    let updatedTask = {
      ...task,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
    };

    try {
      await fetch(`http://localhost:5000/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask),
      });

      setTasks((old) =>
        old.map((t) => (t.id === task.id ? updatedTask : t))
      );

      setIsEditing(false);
    } catch (err) {
      console.log("Error saving edit:", err);
      alert("Failed to update task.");
    }
  }

  

  // get today’s date in YYYY-MM-DD format to prevent past date selection
  function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      {isEditing ? (
        <div className="edit-area">
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <div className="row">
                        {/* prevents selecting past date */}
            <input
              type="date"
              value={dueDate}
              min={getTodayDate()}
              onChange={(e) => setDueDate(e.target.value)}
            />
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div className="view-area">
          <div>
            <h3 style={{ textDecoration: task.completed ? "line-through" : "none" }}>
              {task.title}
            </h3>
            <p>{task.description}</p>
            <p><b>Due:</b> {task.dueDate || "N/A"}</p>
            <p><b>Priority:</b> {task.priority}</p>
          </div>

          <div className="actions">
            <button onClick={toggleComplete}>
              {task.completed ? "Undo" : "Complete"}
            </button>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
