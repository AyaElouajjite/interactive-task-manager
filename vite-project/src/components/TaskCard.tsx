import clsx from "clsx";
import { useParams } from "react-router-dom";
import { useDraggable } from "@dnd-kit/core";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { PRIOTITYSTYELS, TASK_TYPE, formatDate, dateFormatter } from "../utils";
import TaskDialog from "./task/TaskDialog";

const ICONS: any = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task, deleteTask, setTasks }: any) => {
  const params = useParams();
  const status = params?.status || ""; // Utiliser le paramètre `status` des routes
  // Utilisation de useDraggable pour rendre la TaskCard déplaçable
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id, // ID unique pour chaque tâche
  });

  return (
    <div
      ref={setNodeRef} // Référence de l'élément draggable
      {...listeners} // Écouteurs d'événements (comme drag start, drag end)
      {...attributes} // Autres attributs nécessaires pour drag-and-drop
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : "none",
      }}
      className={clsx(
        "w-full h-fit bg-white shadow-md p-4 rounded ",
        status.length === 0 && "cursor-move mb-7"
      )}
    >
      <div className="w-full flex justify-between">
        <div
          className={clsx(
            "flex flex-1 gap-1 items-center text-sm font-medium",
            PRIOTITYSTYELS[task?.priority]
          )}
        >
          <span className="text-lg">{ICONS[task?.priority]}</span>
          <span className="uppercase">{task?.priority} Priority</span>
        </div>
        <div
          onPointerDown={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()} //Bloque aussi `keydown` pour éviter le bug
        >
          <TaskDialog task={task} deleteTask={deleteTask} setTasks={setTasks} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.status])} />
        <h4 className="line-clamp-1 text-black">{task?.title}</h4>
      </div>
      <span className="text-sm text-gray-600">
        {formatDate(new Date(task?.created_at))}
      </span>

      <div className="w-full border-t border-gray-200 my-2" />
      <div className="flex items-center justify-center mb-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Task description </span>
        </div>
      </div>

      <div className="py-4 border-t border-gray-200">
        <span className="text-sm text-gray-600">desc : </span>
        <span className="text-gray-600">{task?.description}</span>
        <br />
        <span className="text-sm text-gray-600">due_date : </span>
        <span className="text-sm text-red-600">
          {dateFormatter(new Date(task?.due_date))}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
