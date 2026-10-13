import { useDroppable } from "@dnd-kit/core";
import TaskCard from "../components/TaskCard";

const Column = ({ id, title, tasks, deleteTask, setTasks }: any) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="w-full p-4 border rounded bg-gray-100 ">
      <h2 className="text-lg font-bold mb-4">{title}</h2>
      {tasks
        .filter((task: any) => task.status === id)
        .map((task: any) => (
          <TaskCard
            key={task.id}
            task={task}
            deleteTask={deleteTask}
            setTasks={setTasks}
          />
        ))}
    </div>
  );
};

export default Column;
