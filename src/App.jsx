import { useState, useEffect } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import Alert from "./components/Alert";
import "./App.css";

function App() {
  // Main tasks state (array of task objects)
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem("tasks");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      return [];
    }
  });

  // Filter and search state (kept here so FilterBar + TaskList can share)
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dueBefore, setDueBefore] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Alert state for error/success messages
  const [alert, setAlert] = useState({ message: '', type: 'error' });

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    try {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
      setAlert({
        message: 'Warning: Failed to save tasks locally. Your changes may not persist.',
        type: 'warning',
      });
    }
  }, [tasks]);

  // Helper: map priority to number for sorting (High first)
  const priorityValue = (p) => {
    if (p === "High") return 3;
    if (p === "Medium") return 2;
    return 1; // Low or unknown
  };

  // Computing the displayed tasks after filtering, searching, and sorting
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

  const handleAlert = (message, type = 'error') => {
    setAlert({ message, type });
  };

  const handleDismissAlert = () => {
    setAlert({ message: '', type: 'error' });
  };

  return (
    <div className="app-container">
      <Alert
        message={alert.message}
        type={alert.type}
        onDismiss={handleDismissAlert}
      />
      <Header />
      <TaskForm setTasks={setTasks} onAlert={handleAlert} />
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
      <TaskList
        tasks={displayedTasks}
        setTasks={setTasks}
        allTasks={tasks}
        onAlert={handleAlert}
      />
    </div>
  );
}

export default App;
