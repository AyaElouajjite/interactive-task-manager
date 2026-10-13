import clsx from "clsx";
import { useState, useEffect } from "react";
import {
  MdDelete,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdOutlineRestore,
} from "react-icons/md";
import { toast } from "sonner";
import Title from "../components/Title";
import Button from "../components/Button";
import ConfirmatioDialog from "../components/Dialogs";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import {
  PRIOTITYSTYELS,
  TASK_TYPE,
  TASK_TYPE_TEXT,
  formatDate,
} from "../utils";

const ICONS: any = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Trash = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [msg, setMsg] = useState("");
  const [type, setType] = useState("delete");
  const [selected, setSelected] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);
  const searchTerm = useSelector((state: RootState) => state.search.searchTerm);

  const [tasks, setTasks] = useState([]);

  // Récupération des tâches supprimées
  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/trash-router?user_id=${user?.id}`
      );
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des tâches");
      const data = await response.json();

      setTasks(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches :", error);
    }
  };

  useEffect(() => {
    if (user?.id) fetchTasks();
  }, [user?.id]);

  const filteredTasks = tasks.filter((task: any) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteAllClick = () => {
    setType("deleteAll");
    setMsg("Do you want to permanently delete all items?");
    setOpenDialog(true);
  };

  const restoreAllClick = () => {
    setType("restoreAll");
    setMsg("Do you want to restore all items in the trash?");
    setOpenDialog(true);
  };

  const deleteClick = (id: any) => {
    setType("delete");
    setSelected(id);
    setOpenDialog(true);
  };

  const restoreClick = (id: any) => {
    setType("restore");
    setSelected(id);
    setMsg("Do you want to restore the selected item?");
    setOpenDialog(true);
  };

  const deleteRestoreHandler = async () => {
    const url =
      type === "deleteAll"
        ? `http://localhost:5000/api/deleteAll?user_id=${user?.id}`
        : type === "restoreAll"
        ? `http://localhost:5000/api/trash-router/user/${user?.id}`
        : type === "delete"
        ? `http://localhost:5000/api/tasks?task_id=${selected}`
        : `http://localhost:5000/api/trash-router/task/${selected}`; //Resotore one by one

    const method = type.includes("delete") ? "DELETE" : "PUT";

    try {
      const response = await fetch(url, { method });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // Récupérer la réponse du serveu
      if (type === "delete") {
        setTasks((prevTasks) =>
          prevTasks.filter((task: any) => task.id !== selected)
        );
      } else {
        await fetchTasks(); // Rafraîchir la liste après restauration
      }

      setOpenDialog(false);
      toast.success(data.message || "Opération réussie !");
    } catch (error) {
      console.error(
        "Erreur lors de la suppression ou de la restauration :",
        error
      );
    }
  };

  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Task Title </th>
        <th className="py-2">Priority</th>
        <th className="py-2">Stage</th>
        <th className="py-2 line-clamp-1">Date Created</th>
        <th className="py-2">description</th>
      </tr>
    </thead>
  );

  const TableRow = ({ item }: any) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      <td className="py-2">
        <div className="flex items-center gap-2">
          <div
            className={clsx(
              "w-4 h-4 rounded-full shrink-0",
              TASK_TYPE[item.status]
            )}
          />
          <p className="w-full line-clamp-2 text-base text-black">
            {item?.title}
          </p>
        </div>
      </td>

      <td className="py-2 capitalize">
        <div className="flex gap-1 items-center">
          <span className={clsx("text-lg", PRIOTITYSTYELS[item?.priority])}>
            {ICONS[item?.priority]}
          </span>
          <span>{item?.priority}</span>
        </div>
      </td>

      <td
        className={clsx(
          "py-2 capitalize text-center md:text-start",
          TASK_TYPE_TEXT[item.status]
        )}
      >
        {item?.status}
      </td>
      <td className="py-2 text-sm">{formatDate(new Date(item?.created_at))}</td>
      <td className="py-2 text-sm">{item?.description}</td>
      <td className="py-2 flex gap-1 justify-end">
        <Button
          icon={<MdOutlineRestore className="text-xl text-gray-500" />}
          onClick={() => restoreClick(item.id)}
        />
        <Button
          icon={<MdDelete className="text-xl text-red-600" />}
          onClick={() => deleteClick(item.id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Trashed Tasks" />
          <div className="flex gap-2 md:gap-4 items-center">
            <Button
              label="Restore All"
              icon={<MdOutlineRestore className="text-lg hidden md:flex" />}
              className="flex flex-row-reverse gap-1 items-center text-black text-sm md:text-base rounded-md 2xl:py-2.5"
              onClick={restoreAllClick}
            />
            <Button
              label="Delete All"
              icon={<MdDelete className="text-lg hidden md:flex" />}
              className="flex flex-row-reverse gap-1 items-center text-red-600 text-sm md:text-base rounded-md 2xl:py-2.5"
              onClick={deleteAllClick}
            />
          </div>
        </div>
        <div className="bg-white px-2 md:px-6 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              <TableHeader />
              <tbody>
                {filteredTasks.length > 0 ? (
                  filteredTasks.map((tk, id) => <TableRow key={id} item={tk} />)
                ) : (
                  <tr>
                    <td className="text-center py-4 text-gray-500">
                      No tasks in trash.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        msg={msg}
        setMsg={setMsg}
        type={type}
        setType={setType}
        onClick={deleteRestoreHandler}
      />
    </>
  );
};

export default Trash;
