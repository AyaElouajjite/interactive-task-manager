import { useState, useEffect } from "react";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import Tabs from "../components/Tabs";
import TaskTitle from "../components/TaskTitle";
import BoardView from "../components/BoardView";
import Table from "../components/task/Table";
import AddTask from "../components/task/AddTask";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { TASK_TYPE } from "../utils";
import { FcGenericSortingAsc, FcGenericSortingDesc } from "react-icons/fc";

const TABS = [
  { title: "Board View", icon: <MdGridView color="#2196f3" /> },
  { title: "Created_At (desc)", icon: <FcGenericSortingDesc /> },
  { title: "Created_At (asc)", icon: <FcGenericSortingAsc /> },
];

const Tasks = () => {
  const { user } = useSelector((state: RootState) => state.auth); //extraire l'utilisateur (user) du state global
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  // Initialiser les tâches avec un état vide
  const status = params?.status || ""; // Utiliser le paramètre `status` des routes
  const priority = params?.priority || "";
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

  const filteredTasks = tasks
    .filter((task: any) => {
      if (status === "completed") return task.status === "done";
      if (status === "in_progress") return task.status === "in_progress";
      if (status === "todo") return task.status === "todo";
      return true;
    })
    .filter(
      (task: any) => task.title.toLowerCase().includes(searchTerm.toLowerCase()) // Filtrage par recherche
    )
    .filter((task: any) => {
      // Appliquer le filtre de priorité uniquement si `priority` est défini et non vide
      if (priority) return task.priority === priority;
      return true;
    });

  // Fonction de suppression à passer à TaskDialog
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
        <Title
          title={
            status || priority
              ? `${status ? `${status} Tasks` : ""} ${
                  priority ? `${priority} priority Tasks` : ""
                }`.trim()
              : "Tasks"
          }
        />

        {!status && !priority && (
          <Button
            onClick={() => setOpen(true)}
            label="Ajouter Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>

      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-6 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle label="In Progress" className={TASK_TYPE.in_progress} />
            <TaskTitle label="Completed" className={TASK_TYPE.done} />
          </div>
        )}

        {selected === 0 ? (
          <BoardView
            tasks={filteredTasks}
            deleteTask={deleteTask}
            setTasks={setTasks}
            status={status}
          />
        ) : selected === 1 ? (
          <Table
            tasks={filteredTasks}
            deleteTask={deleteTask}
            setTasks={setTasks}
          />
        ) : (
          <Table
            tasks={[...filteredTasks].reverse()}
            deleteTask={deleteTask}
            setTasks={setTasks}
          />
        )}
      </Tabs>

      <AddTask open={open} setOpen={setOpen} setTasks={setTasks} />
    </div>
  );
};

export default Tasks;
