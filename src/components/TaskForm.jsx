import { useState } from "react";
import {
  validateTask,
  isPastDate,
  getTodayDate,
} from "../utils/validation";
import { getErrorMessage } from "../utils/errors";

export default function TaskForm({ setTasks, onAlert }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority,
      completed: false,
    };

    const validation = validateTask(newTask);
    if (!validation.valid) {
      onAlert(validation.errors.join(" "), "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to add task");
      }

      const data = await res.json();

      setTasks((old) => [...old, data]);
      onAlert("Task added successfully!", "success");

      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Low");
    } catch (err) {
      console.error("Error saving task:", err);
      const errorMessage = getErrorMessage(err);
      onAlert(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isSubmitting}
        maxLength="200"
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSubmitting}
        maxLength="2000"
      />

      <div className="row">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={isSubmitting}
          min={getTodayDate()}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          disabled={isSubmitting}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}
