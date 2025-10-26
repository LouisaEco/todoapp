// App.jsx - main application (simple and beginner-friendly)
import { useState, useEffect } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  // Main tasks state (array of task objects)
  const [tasks, setTasks] = useState(() => {
    // Load tasks from localStorage if any
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  // Filter and search state (kept here so FilterBar + TaskList can share)
  const [statusFilter, setStatusFilter] = useState("All"); // All, Completed, Incomplete
  const [priorityFilter, setPriorityFilter] = useState("All"); // All, Low, Medium, High
  const [dueBefore, setDueBefore] = useState(""); // date string or empty
  const [searchTerm, setSearchTerm] = useState(""); // search text

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Helper: map priority to number for sorting (High first)
  const priorityValue = (p) => {
    if (p === "High") return 3;
    if (p === "Medium") return 2;
    return 1; // Low or unknown
  };

  // Compute the displayed tasks after filtering, searching, and sorting
  const displayedTasks = tasks
    .filter((t) => {
      // filter by status
      if (statusFilter === "Completed" && !t.completed) return false;
      if (statusFilter === "Incomplete" && t.completed) return false;
      // filter by priority
      if (priorityFilter !== "All" && t.priority !== priorityFilter) return false;
      // filter by due date (if set, show tasks due on or before that date)
      if (dueBefore) {
        if (!t.dueDate) return false; // if task has no due date, exclude when dueBefore is set
        const taskDate = new Date(t.dueDate);
        const limit = new Date(dueBefore);
        // normalize to midnight to avoid timezone issues
        taskDate.setHours(0,0,0,0);
        limit.setHours(0,0,0,0);
        if (taskDate > limit) return false;
      }
      // search filter (title or description)
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const inTitle = t.title.toLowerCase().includes(q);
        const inDesc = (t.description || "").toLowerCase().includes(q);
        if (!inTitle && !inDesc) return false;
      }
      return true;
    })
    .sort((a, b) => {
      // Primary sort: priority (High -> Low)
      const pDiff = priorityValue(b.priority) - priorityValue(a.priority);
      if (pDiff !== 0) return pDiff;
      // Secondary sort: due date ascending (earliest first), empty dueDate go to bottom
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      const ad = new Date(a.dueDate);
      const bd = new Date(b.dueDate);
      return ad - bd;
    });

  return (
    <div className="app-container">
      <Header />
      {/* TaskForm can add tasks and also update the tasks array */}
      <TaskForm setTasks={setTasks} />
      {/* FilterBar controls filters and search */}
      <FilterBar
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        dueBefore={dueBefore}
        setDueBefore={setDueBefore}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {/* TaskList receives the filtered & sorted tasks to display */}
      <TaskList tasks={displayedTasks} setTasks={setTasks} allTasks={tasks} />
    </div>
  );
}

export default App;
