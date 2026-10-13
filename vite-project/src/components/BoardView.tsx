// import { DndContext } from "@dnd-kit/core";
// import Column from "../dnd/column"; // Ce composant représente chaque colonne
// import TaskCard from "./TaskCard";

// const columns = {
//   todo: "To Do",
//   in_progress: "In Progress",
//   done: "Completed",
// };

// const BoardView = ({ tasks, deleteTask, setTasks, status }: any) => {
//   const onDragEnd = (event: any) => {
//     const { active, over } = event;
//     if (!over) return;

//     const taskId = active.id;
//     const newStatus = over.id; // ID de la colonne où on a lâché la tâche

//     setTasks((prevTasks: any) =>
//       prevTasks.map((task: any) =>
//         task.id === taskId ? { ...task, status: newStatus } : task
//       )
//     );
//   };

//   return (
//     <div className="w-full">
//       {tasks.length === 0 ? (
//         <div className="col-span-full text-center text-gray-500 border border-blue-400 p-4 rounded-md shadow-md">
//           Aucune tâche disponible pour le moment.
//         </div>
//       ) : status.length === 0 ? (
//         <DndContext onDragEnd={onDragEnd}>
//           <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
//             {Object.entries(columns).map(([status, label]) => (
//               <Column
//                 key={status}
//                 id={status}
//                 title={label}
//                 tasks={tasks}
//                 deleteTask={deleteTask}
//                 setTasks={setTasks}
//               />
//             ))}
//           </div>
//         </DndContext>
//       ) : (
//         <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
//           {tasks.map((task: any, index: number) => (
//             <TaskCard
//               task={task}
//               key={task.id ?? index}
//               deleteTask={deleteTask}
//               setTasks={setTasks}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default BoardView;

import { DndContext } from "@dnd-kit/core";
import Column from "../dnd/column"; // Composant représentant chaque colonne
import TaskCard from "./TaskCard";
import { toast } from "sonner";
const columns = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Completed",
};

const BoardView = ({ tasks, deleteTask, setTasks, status }: any) => {
  const onDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id; // ID de la colonne où la tâche a été déposée
    // Récupérer la tâche concernée
    const task = tasks.find((task: any) => task.id === taskId);

    // Vérifier si le statut a réellement changé avant de faire l'appel à l'API
    if (task?.status === newStatus) {
      return; // Ne rien faire si le statut n'a pas changé
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour de la tâche");
      }

      // Mettre à jour le state seulement après le succès de l'API
      setTasks((prevTasks: any) =>
        prevTasks.map((task: any) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );
      toast("✅ Task updated successfully!");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  return (
    <div className="w-full">
      {tasks.length === 0 ? (
        <div className="col-span-full text-center text-gray-500 border border-blue-400 p-4 rounded-md shadow-md">
          Aucune tâche disponible pour le moment.
        </div>
      ) : status.length === 0 ? (
        <DndContext onDragEnd={onDragEnd}>
          <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
            {Object.entries(columns).map(([status, label]) => (
              <Column
                key={status}
                id={status}
                title={label}
                tasks={tasks}
                deleteTask={deleteTask}
                setTasks={setTasks}
              />
            ))}
          </div>
        </DndContext>
      ) : (
        <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
          {tasks.map((task: any, index: number) => (
            <TaskCard
              task={task}
              key={task.id ?? index}
              deleteTask={deleteTask}
              setTasks={setTasks}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BoardView;
