//shows a list of TaskItem components
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, setTasks, allTasks }) {

  if (!tasks || tasks.length === 0) {
    return <p className="empty">No tasks match your filters (or no tasks yet).</p>;
  }

  return (
    <div className="task-list">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} setTasks={setTasks} />
      ))}
    </div>
  );
}
