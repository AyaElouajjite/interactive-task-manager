import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdTaskAlt,
  MdOutlinePendingActions,
} from "react-icons/md";

import { FaNewspaper } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import { getInitials } from "../utils";

import clsx from "clsx";
import { Chart } from "../components/Chart";
import { PRIOTITYSTYELS, TASK_TYPE, TASK_TYPE_TEXT } from "../utils";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

/* Debut Task Table */
const TaskTable = ({ tasks }: any) => {
  const ICONS: any = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300 ">
      <tr className="text-black text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2">Status</th>
        <th className="py-2 hidden md:block">Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }: any) => (
    <tr className="border-b border-gray-300 text-gray-600 hover:bg-gray-300/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.status])}
          />

          <p className="text-base text-black">{task.title}</p>
        </div>
      </td>

      <td className="py-2">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
            {ICONS[task.priority]}
          </span>
          <span className="capitalize">{task.priority}</span>
        </div>
      </td>
      <td className="py-2">
        <div className="flex gap-1 items-center">
          <span className={clsx("capitalize", TASK_TYPE_TEXT[task.status])}>
            {task.status}
          </span>
        </div>
      </td>
      <td className="py-2 hidden md:block">
        <span className="text-base text-gray-600">
          {moment(task?.created_at).fromNow()}
        </span>
      </td>
    </tr>
  );
  return (
    <>
      <div className="w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
        <h4 className="text-xl text-gray-600 font-semibold mb-5">
          Last tasks added
        </h4>
        <table className="w-full">
          <TableHeader />
          <tbody>
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-4 text-center text-gray-500">
                  Aucune tâche Pour le moment
                </td>
              </tr>
            ) : (
              tasks?.map((task: any, id: any) => (
                <TableRow key={id} task={task} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
/* Fin Task Table */

/* Debut user Table */
const UserTable = ({ users }: any) => {
  const loginTime = localStorage.getItem("loginTime");
  const TableHeader = () => (
    <thead className="border-b border-gray-300 ">
      <tr className="text-black  text-left">
        <th className="py-2">Nom</th>
        <th className="py-2">Email</th>
        <th className="py-2">Connecté</th>
      </tr>
    </thead>
  );

  const TableRow = ({ user }: any) => (
    <tr className="border-b border-gray-200  text-gray-600 hover:bg-gray-400/10">
      <td className="py-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700">
            <span className="text-center">{getInitials(user?.name)}</span>
          </div>
        </div>
      </td>

      <td>
        <p className="w-fit px-3 py-1 rounded-full text-sm bg-blue-200">
          {user?.email}
        </p>
      </td>
      <td className="py-2 text-sm">depuis : {loginTime}</td>
    </tr>
  );

  return (
    <div className="w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded">
      <h4 className="text-xl text-gray-600 font-semibold mb-5">
        User informations
      </h4>
      <table className="w-full mb-2">
        <TableHeader />
        <tbody>
          <TableRow key={users?.id} user={users} />
        </tbody>
      </table>
    </div>
  );
};
/* Fin user Table */

const Dashboard = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({});
  const [chartData, setChartData] = useState<any[]>([]);
  const { user } = useSelector((state: RootState) => state.auth); //extraire l'utilisateur (user) du state global

  useEffect(() => {
    // Fetch tasks
    fetch(`http://localhost:5000/api/tasks?user_id=${user?.id}`)
      .then((response) => response.json())
      .then((data) => {
        setTasks(data);

        // Calcul des totaux des tâches par statut
        const taskTotals = {
          totalTasks: data.length,
          completed: data.filter((task: any) => task.status === "done").length,
          "in progress": data.filter(
            (task: any) => task.status === "in_progress"
          ).length,
          todo: data.filter((task: any) => task.status === "todo").length,
          trash: 0, // Initialisation
          trashByStatus: { done: 0, in_progress: 0, todo: 0 }, // Nouveau
        };

        // Fetch trash (tâches supprimées)
        fetch(`http://localhost:5000/api/tasks/trash?user_id=${user?.id}`)
          .then((response) => response.json())
          .then((trashData) => {
            taskTotals.trash = trashData.length;
            taskTotals.trashByStatus = {
              done: trashData.filter((task: any) => task.status === "done")
                .length,
              in_progress: trashData.filter(
                (task: any) => task.status === "in_progress"
              ).length,
              todo: trashData.filter((task: any) => task.status === "todo")
                .length,
            };

            setTotals(taskTotals); // Mettre à jour les totaux avec les trash par statut
          })
          .catch((error) => {
            console.error("Error fetching trash:", error);
          });

        // Préparation des données pour le graphique par priorité
        const priorityData = [
          {
            name: "High",
            total: data.filter((t: any) => t.priority === "high").length,
            color: "#e7000b", //red
          },
          {
            name: "Medium",
            total: data.filter((t: any) => t.priority === "medium").length,
            color: "#d08700", //yellow
          },
          {
            name: "Low",
            total: data.filter((t: any) => t.priority === "low").length,
            color: "#155dfc", //blue
          },
        ];
        setChartData(priorityData);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }, [user?.id]);

  // Stats data for cards
  const stats = [
    {
      _id: "1",
      label: "TOTAL TASK",
      total: totals?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
      trash: totals?.trash || 0, // Ajoutez l'information trash ici, sinon mettez 0
    },
    {
      _id: "2",
      label: "COMPLETED TASK",
      total: totals["completed"] || 0,
      icon: <MdTaskAlt />,
      bg: "bg-[#00a63e]",
      trash: totals?.trashByStatus?.done || 0, // Ajoutez l'information trash ici, sinon mettez 0
    },
    {
      _id: "3",
      label: "TASK IN PROGRESS",
      total: totals["in progress"] || 0,
      icon: <MdOutlinePendingActions />,
      bg: "bg-[#f59e0b]",
      trash: totals?.trashByStatus?.in_progress || 0, // Ajoutez l'information trash ici, sinon mettez 0
    },
    {
      _id: "4",
      label: "TODOS",
      total: totals["todo"] || 0,
      icon: <FaArrowsToDot />,
      bg: "bg-[#155dfc]",
      trash: totals?.trashByStatus?.todo || 0, // Ajoutez l'information trash ici, sinon mettez 0
    },
  ];

  const Card = ({ label, count, bg, icon, trash }: any) => {
    return (
      <div className="w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between mb-2">
        <div className="h-full flex flex-1 flex-col justify-between">
          <p className="text-base text-gray-600">{label}</p>
          <span className="text-2xl font-semibold">{count}</span>
          <span className="text-sm text-gray-400">
            {" "}
            {label} trash {trash}
          </span>
        </div>

        <div
          className={clsx(
            "w-10 h-10 rounded-full flex items-center justify-center text-white",
            bg
          )}
        >
          {icon}
        </div>
      </div>
    );
  };
  return (
    <div className="h-full py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {stats.map(({ icon, bg, label, total, trash }, index) => (
          <Card
            key={index}
            icon={icon}
            bg={bg}
            label={label}
            count={total}
            trash={trash}
          />
        ))}
      </div>

      <div className="w-full bg-white my-16 p-4 rounded shadow-sm">
        <h4 className="text-xl text-gray-600 font-semibold mb-5">
          Chart by Priority
        </h4>
        <Chart priorityData={chartData} />
      </div>

      <div className="w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8">
        {/* /left */}

        <TaskTable tasks={tasks} />

        {/* /right */}

        <UserTable users={user} />
      </div>
    </div>
  );
};

export default Dashboard;
