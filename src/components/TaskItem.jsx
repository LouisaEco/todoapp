// TaskItem.jsx - simple beginner-style edit, delete, complete features
import { useState } from "react";

export default function TaskItem({ task, setTasks }) {
  const [isEditing, setIsEditing] = useState(false);

  // local state used while editing
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [dueDate, setDueDate] = useState(task.dueDate || "");
  const [priority, setPriority] = useState(task.priority || "Low");

  const toggleComplete = () => {
    setTasks((old) => old.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = () => {
    if (confirm("Delete this task?")) {
      setTasks((old) => old.filter((t) => t.id !== task.id));
    }
  };

  // helper for past date
  const isPastDate = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    d.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return d < today;
  };

  const saveEdit = () => {
    if (title.trim() === "") {
      alert("Title cannot be empty.");
      return;
    }
    if (isPastDate(dueDate)) {
      alert("Due date cannot be in the past.");
      return;
    }

    setTasks((old) =>
      old.map((t) =>
        t.id === task.id
          ? { ...t, title: title.trim(), description: description.trim(), dueDate: dueDate || "", priority }
          : t
      )
    );
    setIsEditing(false);
  };

  const cancelEdit = () => {
    // reset fields and stop editing
    setTitle(task.title);
    setDescription(task.description || "");
    setDueDate(task.dueDate || "");
    setPriority(task.priority || "Low");
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      {isEditing ? (
        <div className="edit-area">
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          <div className="row">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div className="actions">
            <button onClick={saveEdit} className="primary">Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="view-area">
          <div className="left">
            <h3>{task.title}</h3>
            {task.description && <p className="small">{task.description}</p>}
            <p className="small"><strong>Due:</strong> {task.dueDate || "N/A"}</p>
            <p className="small"><strong>Priority:</strong> {task.priority}</p>
          </div>

          <div className="right">
            <button onClick={toggleComplete}>{task.completed ? "Undo" : "Complete"}</button>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={deleteTask}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}
