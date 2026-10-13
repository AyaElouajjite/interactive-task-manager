import React, { useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";

const initialTasks = [
  { id: "1", title: "Tâche 1", status: "todo" },
  { id: "2", title: "Tâche 2", status: "inprogress" },
  { id: "3", title: "Tâche 3", status: "completed" },
];

const columns = {
  todo: "À faire",
  inprogress: "En cours",
  completed: "Terminé",
};

export default function Board() {
  const [tasks, setTasks] = useState(initialTasks);

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 p-4">
        {Object.entries(columns).map(([status, label]) => (
          <Column key={status} id={status} title={label} tasks={tasks} />
        ))}
      </div>
    </DndContext>
  );
}

function Column({ id, title, tasks }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="w-64 p-4 border rounded">
      <h2 className="text-lg font-bold mb-2">{title}</h2>
      {tasks
        .filter((task) => task.status === id)
        .map((task) => (
          <Task key={task.id} id={task.id} title={task.title} />
        ))}
    </div>
  );
}

function Task({ id, title }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="p-2 bg-gray-200 rounded mb-2 cursor-pointer"
      style={{
        transform: transform
          ? `translate(${transform.x}px, ${transform.y}px)`
          : "none",
      }}
    >
      {title}
    </div>
  );
}
