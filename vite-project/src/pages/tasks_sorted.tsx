import { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";

import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { FcGenericSortingAsc, FcGenericSortingDesc } from "react-icons/fc";
const TABS = [
  { title: "Sort by Due_Date (Desc)", icon: <FcGenericSortingDesc /> },
  { title: "Sort by Due_Date (Asc)", icon: <FcGenericSortingAsc /> },
];

const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

const TaskSorted = () => {
  const { user } = useSelector((state: RootState) => state.auth); //extraire l'utilisateur (user) du state global
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);

  const status = params?.status || ""; // Utiliser le paramètre `status` des routes

  useEffect(() => {
    fetch(`http://localhost:5000/api/tasks?user_id=${user?.id}`)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des tâches :", error);
        setLoading(false);
      });
  }, []); // Le `useEffect` se déclenche seulement au montage du composant

  // Trier les tâches en fonction de l'onglet sélectionné
  const sortedTasks = [...tasks].sort((a: any, b: any) => {
    const dateA = a.due_date || "";
    const dateB = b.due_date || "";

    if (selected === 0) {
      return dateB.localeCompare(dateA); // Tri décroissant (desc)
    } else if (selected === 1) {
      return dateA.localeCompare(dateB); // Tri croissant (asc)
    }

    return 0;
  });

  const filteredTasks = sortedTasks.filter((task: any) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteTask = (taskId: number) => {
    setTasks((prevTasks: any) =>
      prevTasks.filter((task: any) => task.id !== taskId)
    );
  };

  return loading ? (
    <div className="py-10">
      <Loading />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <Title title="Tasks sorted by due_date" />
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle
              label="In Progress"
              className={TASK_TYPE["in progress"]}
            />
            <TaskTitle label="Completed" className={TASK_TYPE.completed} />
          </div>
        )}

        <Table
          tasks={filteredTasks}
          deleteTask={deleteTask}
          setTasks={setTasks}
        />
      </Tabs>

      <AddTask open={open} setOpen={setOpen} setTasks={setTasks} />
    </div>
  );
};

export default TaskSorted;
