import express from "express";
import db from "../config/db.js";

const tasksRouter = express.Router();

// Récupérer toutes les tâches non supprimées
tasksRouter.get("/", (req, res) => {
  const user_id = req.query.user_id;
  db.query(
    "SELECT * FROM task WHERE id_user = ? AND isDeleted = FALSE order by created_at desc",
    [user_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

tasksRouter.get("/trash", (req, res) => {
  const user_id = req.query.user_id;
  db.query(
    "SELECT * FROM task WHERE id_user = ? AND isDeleted = TRUE",
    [user_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results); // Renvoyer uniquement les tâches supprimées
    }
  );
});

// **Récupérer une tâche**
tasksRouter.get("/:id", (req, res) => {
  const taskId = req.params.id; // Récupérer l'id de la tâche depuis l'URL
  db.query(
    "SELECT * FROM task WHERE id = ? AND isDeleted = FALSE",
    [taskId],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
      }
      if (results.length > 0) {
        res.json(results[0]); // Renvoyer la première tâche trouvée
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    }
  );
});

//Ajouter une nouvelle tâche
tasksRouter.post("/", (req, res) => {
  const { title, description, status, priority, id_user, due_date } = req.body;
  db.query(
    "INSERT INTO task (title, description, status , priority, created_at , id_user,due_date) VALUES (?, ?, ?, ? , NOW(), ?,?)",
    [
      title,
      description,
      status || "todo",
      priority || "medium",
      id_user,
      due_date,
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "✅ Tâche ajoutée", taskId: result.insertId });
    }
  );
});

// Route PUT pour mettre à jour une tâche
// tasksRouter.put("/:id", (req, res) => {
//   const { title, description, status, priority, due_date } = req.body;
//   const { id } = req.params; // L'ID de la tâche à mettre à jour est dans les paramètres de l'URL

//   // Requête SQL pour mettre à jour la tâche avec l'ID donné
//   db.query(
//     "UPDATE task SET title = ?, description = ?, status = ?, priority = ?, due_date = ? WHERE id = ?",
//     [
//       title,
//       description,
//       status || "todo",
//       priority || "medium",
//       due_date || null,
//       id,
//     ],
//     (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }

//       if (result.affectedRows === 0) {
//         return res.status(404).json({ error: "Task not found" });
//       }

//       res.json({ message: "✅ Tâche mise à jour", taskId: id });
//     }
//   );
// });

tasksRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date } = req.body;

  // Créer une liste des champs à mettre à jour dynamiquement
  let fields = [];
  let values = [];

  if (title !== undefined) {
    fields.push("title = ?");
    values.push(title);
  }
  if (description !== undefined) {
    fields.push("description = ?");
    values.push(description);
  }
  if (status !== undefined) {
    fields.push("status = ?");
    values.push(status);
  }
  if (priority !== undefined) {
    fields.push("priority = ?");
    values.push(priority);
  }
  if (due_date !== undefined) {
    fields.push("due_date = ?");
    values.push(due_date);
  }

  if (fields.length === 0) {
    return res.status(400).json({ error: "Aucune mise à jour fournie" });
  }

  values.push(id); // Ajouter l'ID à la fin des valeurs
  const sql = `UPDATE task SET ${fields.join(", ")} WHERE id = ?`;

  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json({ message: "✅ Tâche mise à jour", taskId: id });
  });
});

// Supprimer une tâche
tasksRouter.delete("/", (req, res) => {
  const taskId = req.query.task_id;

  db.query("DELETE FROM task WHERE id = ?", [taskId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.json({ message: "✅ Tâche supprimée avec succès", taskId });
  });
});

// Marquer une tâche comme supprimée
tasksRouter.put("/trashed/:id", (req, res) => {
  const taskId = req.params.id;

  db.query(
    "UPDATE task SET isDeleted = TRUE WHERE id = ?",
    [taskId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }

      res.json({
        message: "✅ Tâche marquée comme supprimée avec succès",
        taskId,
      });
    }
  );
});

export default tasksRouter;
