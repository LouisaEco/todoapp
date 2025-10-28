import { useState } from "react";

export default function TaskForm({ setTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");

  // check if user picked a past date
  function isPastDate(date) {
    if (!date) return false;
    let now = new Date();
    let chosen = new Date(date);
    now.setHours(0, 0, 0, 0);
    chosen.setHours(0, 0, 0, 0);
    return chosen < now;
  }

  // when user clicks "Add Task"
  async function handleSubmit(e) {
    e.preventDefault();

    if (title.trim() === "") {
      alert("Please enter a title");
      return;
    }

    if (isPastDate(dueDate)) {
      alert("Due date cannot be in the past!");
      return;
    }

    let newTask = {
      title,
      description,
      dueDate,
      priority,
      completed: false,
    };

    try {
      // send new task to backend
      let res = await fetch("http://localhost:5000/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      let data = await res.json();

      // show new task instantly
      setTasks((old) => [...old, data]);

      // clear input boxes
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Low");
    } catch (err) {
      console.log("Error saving task:", err);
      alert("Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      ></textarea>

      <div className="row">
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>

      <button type="submit">Add Task</button>
    </form>
  );
}
