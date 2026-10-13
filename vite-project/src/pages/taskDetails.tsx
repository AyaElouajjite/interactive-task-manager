import clsx from "clsx";

import { useEffect } from "react";
import { useState } from "react";
import { FaBug, FaTasks, FaThumbsUp, FaUser } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineDoneAll,
  MdOutlineMessage,
} from "react-icons/md";

import { useParams } from "react-router-dom";

import Tabs from "../components/Tabs";
import {
  PRIOTITYSTYELS,
  TASK_TYPE,
  getInitials,
  TASK_TYPE_TEXT,
  formatDate,
  dateFormatter,
} from "../utils";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ICONS: any = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const bgColor: any = {
  high: "bg-red-200",
  medium: "bg-yellow-200",
  low: "bg-blue-200",
};

const TABS = [{ title: "Task Detail", icon: <FaTasks /> }];

const TASKTYPEICON: any = {
  commented: (
    <div className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white">
      <MdOutlineMessage />,
    </div>
  ),
  started: (
    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
      <FaThumbsUp size={20} />
    </div>
  ),
  assigned: (
    <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-500 text-white">
      <FaUser size={14} />
    </div>
  ),
  bug: (
    <div className="text-red-600">
      <FaBug size={24} />
    </div>
  ),
  completed: (
    <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white">
      <MdOutlineDoneAll size={24} />
    </div>
  ),
  "in progress": (
    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-violet-600 text-white">
      <GrInProgress size={16} />
    </div>
  ),
};

const act_types = [
  "Started",
  "Completed",
  "In Progress",
  "Commented",
  "Bug",
  "Assigned",
];

const TaskDetails = () => {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth); //extraire l'utilisateur (user) du state global
  const loginTime = localStorage.getItem("loginTime");
  const [selected, setSelected] = useState(0);
  const [tas, setTask] = useState<{
    id?: number;
    title?: string;
    created_at?: any;
    priority?: any;
    status?: any;
    description?: any;
    due_date?: any;
  } | null>(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/tasks/${id}`)
      .then((response) => response.json())
      .then((data) => setTask(data))
      .catch((err) =>
        console.error("Erreur lors de la récupération du task:", err)
      );
  }, [id]);
  return (
    <div className="w-full flex flex-col gap-3 mb-4 overflow-y-hidden">
      <Tabs tabs={TABS} setSelected={setSelected}>
        {selected === 0 ? (
          <div className="w-full flex flex-col md:flex-row gap-5 2xl:gap-8 bg-white shadow-lg rounded-xl p-6 overflow-y-auto">
            {/* LEFT - Task Details */}
            <div className="w-full md:w-1/2 space-y-6">
              {/* Task Title */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  📝 Titre :
                </h3>
                <p className="text-gray-700">
                  {tas?.title || "Aucun titre fourni"}
                </p>
              </div>

              {/* Priority and Status */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">
                  🚀 Priorité :
                </h3>
                <div
                  className={clsx(
                    "inline-flex items-center gap-2 text-base font-semibold px-3 py-1 rounded-full",
                    PRIOTITYSTYELS[tas?.priority],
                    bgColor[tas?.priority]
                  )}
                >
                  <span className="text-lg">{ICONS[tas?.priority]}</span>
                  <span className="uppercase">
                    {tas?.priority || "Non défini"}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  📊 Statut :
                </h3>
                <div className="flex items-center gap-2">
                  <div
                    className={clsx(
                      "w-4 h-4 rounded-full",
                      TASK_TYPE[tas?.status]
                    )}
                  />
                  <p
                    className={clsx(
                      "text-lg font-medium",

                      TASK_TYPE_TEXT[tas?.status]
                    )}
                  >
                    {tas?.status || "Non défini"}
                  </p>
                </div>
              </div>

              {/* Created At */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  🕒 Créé le :
                </h3>
                <p className="text-lg text-gray-500">
                  {tas?.created_at
                    ? formatDate(new Date(tas?.created_at))
                    : "Date non disponible"}
                </p>
              </div>

              {/* Assets & Subtasks */}
              <div className="p-4 border border-red-200 rounded-lg bg-red-50 space-y-2">
                <div>
                  <span className="font-semibold">🕒 Date Echeance :</span>{" "}
                  {dateFormatter(new Date(tas?.due_date)) ?? 0}
                </div>
              </div>

              {/* Task Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  📖 Description :
                </h3>
                <p className="text-gray-600">
                  {tas?.description ||
                    "Aucune description fournie pour cette tâche."}
                </p>
              </div>
            </div>

            {/* RIGHT - User Details */}
            <div className="w-full md:w-1/2 space-y-6">
              <h3 className="text-xl font-bold text-gray-800">
                👤 Détails de l'utilisateur
              </h3>

              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                {/* Nom */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold">
                    {getInitials(user?.name)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Nom :</h4>
                    <p className="text-gray-700">
                      {user?.name || "Nom non disponible"}
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <h4 className="font-semibold text-gray-800">📧 Email :</h4>
                  <p className="text-gray-700">
                    {user?.email || "Email non disponible"}
                  </p>
                </div>

                {/* Login Time */}
                <div>
                  <h4 className="font-semibold text-gray-800">
                    🔗 Connecté depuis :
                  </h4>
                  <p className="text-gray-700">
                    {loginTime || "Heure de connexion non disponible"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Tabs>
    </div>
  );
};

export default TaskDetails;
