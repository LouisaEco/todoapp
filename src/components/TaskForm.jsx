// TaskForm.jsx - add new task (validates title and due date)
import { useState } from "react";

export default function TaskForm({ setTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");

  // helper: checks if given date string is before today
  const isPastDate = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    d.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    return d < today;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") {
      alert("Task title cannot be empty.");
      return;
    }
    if (isPastDate(dueDate)) {
      alert("Due date cannot be in the past.");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate ? dueDate : "",
      priority,
      completed: false,
    };

    setTasks((old) => [...old, newTask]);

    // clear form
    setTitle("");
    setDescription("");
    setDueDate("");
    setPriority("Low");
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Task title *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="row">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <button type="submit" className="primary">Add Task</button>
    </form>
  );
}
