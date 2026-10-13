import express from "express";
import db from "../config/db.js";

const trashRouter = express.Router();

// Récupérer toutes les tâches supprimées
trashRouter.get("/", (req, res) => {
  const user_id = req.query.user_id;
  db.query(
    "SELECT * FROM task WHERE id_user = ? AND isDeleted = TRUE order by created_at desc",
    [user_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    }
  );
});

// Restore one by one
trashRouter.put("/task/:id", (req, res) => {
  const taskId = req.params.id;

  db.query(
    "UPDATE task SET isDeleted = FALSE WHERE id = ?",
    [taskId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }

      res.json({
        message: "✅ Tâche Recuperé avec succès",
        taskId,
      });
    }
  );
});

// Recuperer  tous les tâche from trash
trashRouter.put("/user/:id", (req, res) => {
  const id_user = req.params.id;

  db.query(
    "UPDATE task SET isDeleted = FALSE WHERE id_user = ? and isDeleted = 1",
    [id_user],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }

      res.json({
        message: "✅ toutes les Tâches Recuperé avec succès",
        taskIdaffectedRows: result.affectedRows,
      });
    }
  );
});

export default trashRouter;
