import { useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import SelectList from "../SelectList";
import Button from "../Button";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
const LISTS = ["TODO", "IN_PROGRESS", "DONE"];
const PRIORIRY = ["HIGH", "MEDIUM", "LOW"];

const AddTask = ({ open, setOpen, setTasks, task }: any) => {
  //const task: any = "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Pré-remplir les champs si `task` existe
  useEffect(() => {
    if (task) {
      setValue("title", task.title);
      setValue("description", task.description);
      const localDate = new Date(task.due_date); // Crée un objet Date
      const formattedDate = localDate.toLocaleDateString("fr-CA"); // Format : YYYY-MM-DD
      setValue("due_date", formattedDate);
    }
  }, [task, setValue]);

  const { user } = useSelector((state: RootState) => state.auth); //extraire l'utilisateur (user) du state global
  const [status, setStatus] = useState(task?.status?.toUpperCase() || LISTS[0]);
  const [priority, setPriority] = useState(
    task?.priority?.toUpperCase() || PRIORIRY[2]
  );

  const submitHandler = async (data: any) => {
    try {
      const url = task
        ? `http://localhost:5000/api/tasks/${task.id}`
        : "http://localhost:5000/api/tasks";
      const method = task ? "PUT" : "POST"; // Utilise PUT pour modifier

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          priority: priority,
          status: status.toLowerCase(),
          id_user: user?.id,
          due_date: data.due_date, // Si tu veux ajouter la date d'échéance
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast("✅ Task " + (task ? "updated" : "added") + " successfully!");
        reset(); // Réinitialiser le formulaire

        // Ajouter ou mettre à jour la tâche dans l'état local des tâches
        setTasks((prevTasks: any) => {
          if (task) {
            // Mise à jour de la tâche existante
            return prevTasks.map((t: any) =>
              t.id === task.id
                ? {
                    ...t,
                    title: data.title,
                    description: data.description,
                    status: status.toLowerCase(),
                    priority: priority.toLowerCase(),
                    due_date: data.due_date, // Mettre à jour la date d'échéance si nécessaire
                  }
                : t
            );
          } else {
            // Ajout d'une nouvelle tâche
            return [
              ...prevTasks,
              {
                id: result.taskId,
                title: data.title,
                description: data.description,
                status: status.toLowerCase(),
                priority: priority.toLowerCase(),
                created_at: new Date().toISOString(), // Date courante
                due_date: data.due_date, // Inclure la date d'échéance si besoin
              },
            ].sort((a, b) => {
              const dateA = new Date(a.created_at).getTime(); // Conversion en timestamp
              const dateB = new Date(b.created_at).getTime(); // Conversion en timestamp
              return dateB - dateA; // Trie du plus récent au plus ancien
            });
          }
        });

        setOpen(false); // Fermer le modal après la soumission
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("An error occurred while submitting the task.");
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as="h2"
            className="text-base font-bold leading-6 text-gray-900 mb-4"
          >
            {task ? "UPDATE TASK" : "ADD TASK"}
          </Dialog.Title>

          <div className="mt-2 flex flex-col gap-6">
            <Textbox
              placeholder="Task Title"
              type="text"
              name="title"
              label="Task Title"
              className="w-full rounded"
              register={register("title", { required: "Title is required" })}
              error={errors.title ? errors.title.message : ""}
            />

            <Textbox
              placeholder="Task Description"
              type="text"
              name="description"
              label="Description"
              className="w-full rounded"
              register={register("description", {
                required: "Description is required",
              })}
              error={errors.description ? errors.description.message : ""}
            />

            <div className="flex gap-4">
              <SelectList
                label="Task Stage"
                lists={LISTS}
                selected={status}
                setSelected={setStatus}
              />
              <Textbox
                placeholder="Due Date"
                type="date"
                name="due_date"
                label="Due Date"
                className="w-full rounded"
                register={register("due_date", {
                  required: "Due Date is required!",
                })}
                error={errors.due_date ? errors.due_date.message : ""}
              />
            </div>

            <div className="flex gap-4">
              <SelectList
                label="Priority Level"
                lists={PRIORIRY}
                selected={priority}
                setSelected={setPriority}
              />
            </div>

            <div className="bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4 pr-2">
              <Button
                label="Submit"
                type="submit"
                className="bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto"
              />

              <Button
                type="button"
                className="bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          </div>
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddTask;
