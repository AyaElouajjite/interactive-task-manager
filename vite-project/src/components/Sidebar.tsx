import { useDispatch } from "react-redux"; // Importation de useDispatch
import { Link, useLocation } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";
import {
  MdDashboard,
  MdOutlineAddTask,
  MdOutlinePendingActions,
  MdTaskAlt,
} from "react-icons/md";
import { FaTasks, FaTrashAlt } from "react-icons/fa";
import { BsSortUp } from "react-icons/bs";
import { TASK_TYPE_TEXT } from "../utils/";
import { FaArrowsToDot } from "react-icons/fa6";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";

const linkData = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: <MdDashboard />,
    Classcolor: "",
  },
  {
    label: "Tasks",
    link: "tasks",
    icon: <FaTasks />,
    Classcolor: "",
  },
  {
    label: "Completed",
    link: "completed/completed",
    icon: <MdTaskAlt />,
    Classcolor: TASK_TYPE_TEXT.done,
  },
  {
    label: "In Progress",
    link: "in_progress/in_progress",
    icon: <MdOutlinePendingActions />,
    Classcolor: TASK_TYPE_TEXT.in_progress,
  },
  {
    label: "To do",
    link: "todo/todo",
    icon: <FaArrowsToDot />,
    Classcolor: TASK_TYPE_TEXT.todo,
  },
  {
    label: "High priority",
    link: "high/high",
    icon: <MdKeyboardDoubleArrowUp />,
    Classcolor: "text-red-600",
  },
  {
    label: "Medium priority",
    link: "medium/medium",
    icon: <MdKeyboardArrowUp />,
    Classcolor: TASK_TYPE_TEXT.in_progress,
  },
  {
    label: "Low priority",
    link: "low/low",
    icon: <MdKeyboardArrowDown />,
    Classcolor: TASK_TYPE_TEXT.todo,
  },

  {
    label: "Sorted by due date",
    link: "sorted_due_date",
    icon: <BsSortUp />,
    Classcolor: "",
  },

  {
    label: "Trash ",
    link: "trashed",
    icon: <FaTrashAlt />,
    Classcolor: "text-red-600",
  },
];
const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const path = location.pathname.split("/")[1];

  const sidebarLinks = linkData;
  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };

  const NavLink = ({ el }: any) => {
    const isActive = path === el.link.split("/")[0]; // Vérifie si le lien est actif
    return (
      <Link
        to={el.link}
        onClick={closeSidebar}
        className={clsx(
          "w-full lg:w-3/4 flex gap-2 px-3 py-2 rounded-full items-center text-gray-800 text-base hover:bg-[#2564ed2d]",
          isActive ? "bg-blue-700 text-neutral-100" : ""
        )}
      >
        <span
          style={{ color: isActive ? "white" : el.Classcolor }}
          className={clsx(!el.Classcolor.startsWith("#") && el.Classcolor)}
        >
          {el.icon}
        </span>
        <span className="hover:text-[#2564ed]">{el.label}</span>
      </Link>
    );
  };

  return (
    <div className="w-full  h-full flex flex-col gap-6 p-5">
      <h1 className="flex gap-1 items-center">
        <p className="bg-blue-600 p-2 rounded-full">
          <MdOutlineAddTask className="text-white text-2xl font-black" />
        </p>
        <span className="text-xl font-bold text-black">T-Manage</span>
      </h1>

      <div className="flex-1 flex flex-col gap-y-5 py-8">
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>
    </div>
  );
};
export default Sidebar;
