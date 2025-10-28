import TaskItem from "./TaskItem";

export default function TaskList({ tasks, setTasks }) {

  // delete task from backend and frontend
  async function handleDelete(id) {
    let sure = confirm("Are you sure you want to delete this task?");
    if (!sure) return;

    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: "DELETE",
      });

      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.log("Error deleting task:", err);
      alert("Could not delete task. Try again.");
    }
  }

  if (!tasks || tasks.length === 0) {
    return <p className="empty">No tasks yet</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          setTasks={setTasks}
          handleDelete={handleDelete}
        />
      ))}
    </div>
  );
}
