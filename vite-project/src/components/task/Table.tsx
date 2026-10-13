import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTask from "../task/AddTask";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import {
  PRIOTITYSTYELS,
  TASK_TYPE,
  formatDate,
  dateFormatter,
} from "../../utils";
import clsx from "clsx";
import Button from "../Button";
import ConfirmatioDialog from "../Dialogs";
import axios from "axios"; // Assurez-vous d'importer axios

const ICONS: any = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks, deleteTask, setTasks }: any) => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [editTask, setEditTask] = useState<any>(null); // Pour stocker la tâche à éditer

  const deleteClicks = (id: any) => {
    setSelected(() => id);
    setOpenDialog(true);
  };

  // Suppression de la tâche
  const deleteHandler = async () => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/trashed/${selected}`);
      toast("✅ task supprimée (corbeil)!");
      setOpenDialog(false);
      deleteTask(selected);
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
    }
  };

  const TableHeader = () => (
    <thead className="w-full border-b border-gray-300">
      <tr className="w-full text-black  text-left">
        <th className="py-2">Task Title</th>
        <th className="py-2">Priority</th>
        <th className="py-2 line-clamp-1">Created At</th>
        <th className="py-2">Description</th>
        <th className="py-2">Due_date</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }: any) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-300/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              "w-4 h-4 rounded-full  shrink-0",
              TASK_TYPE[task.status]
            )}
          />
          <p className="w-full line-clamp-2 text-base text-black">
            {task?.title}
          </p>
        </div>
      </td>

      <td className="py-2">
        <div className={"flex gap-1 items-center"}>
          <span className={clsx("text-lg", PRIOTITYSTYELS[task?.priority])}>
            {ICONS[task?.priority]}
          </span>
          <span
            className={clsx(
              "capitalize line-clamp-1",
              PRIOTITYSTYELS[task?.priority]
            )}
          >
            {task?.priority} Priority
          </span>
        </div>
      </td>

      <td className="py-2">
        <span className="text-sm text-gray-600">
          {formatDate(new Date(task?.created_at))}
        </span>
      </td>

      <td className="py-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{task?.description}</span>
        </div>
      </td>
      <td className="py-2">
        <div className="flex items-center gap-3">
          <span className="text-sm text-red-600">
            {" "}
            {dateFormatter(new Date(task?.due_date))}
          </span>
        </div>
      </td>

      <td className="py-2 flex gap-2 md:gap-4 justify-end">
        <Button
          className="text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base"
          label="Open"
          type="button"
          onClick={() => navigate(`/task/${task.id}`)}
        />

        <Button
          className="text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base"
          label="Edit"
          type="button"
          onClick={() => {
            setEditTask(task); // Stocker la tâche sélectionnée
            setOpenEdit(true); // Ouvrir le modal
          }}
        />

        <Button
          className="text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base"
          label="Delete"
          type="button"
          onClick={() => deleteClicks(task.id)}
        />
      </td>
    </tr>
  );
  return (
    <>
      <div className="bg-white  px-2 md:px-4 pt-4 pb-9 shadow-md rounded">
        <div className="overflow-x-auto max-h-[500px]">
          <table className="w-full  min-w-[800px]">
            <TableHeader />
            <tbody>
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-gray-500">
                    Aucune tâche Pour le moment
                  </td>
                </tr>
              ) : (
                tasks.map((task: any, index: any) => (
                  <TableRow key={index} task={task} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={editTask}
        key={new Date().getTime()}
        setTasks={setTasks}
      />

      {/* TODO */}
      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />
    </>
  );
};

export default Table;
