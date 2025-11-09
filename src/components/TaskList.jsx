import TaskItem from "./TaskItem";
import { getErrorMessage } from "../utils/errors";

export default function TaskList({ tasks, setTasks, allTasks, onAlert }) {
  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete task");
      }

      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
      onAlert("Task deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting task:", err);
      const errorMessage = getErrorMessage(err);
      onAlert(errorMessage, "error");
    }
  }

  if (!tasks || tasks.length === 0) {
    return (
      <p className="empty">
        {allTasks?.length === 0
          ? "No tasks yet. Create one to get started!"
          : "No tasks match your filters."}
      </p>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          setTasks={setTasks}
          handleDelete={handleDelete}
          onAlert={onAlert}
        />
      ))}
    </div>
  );
}
