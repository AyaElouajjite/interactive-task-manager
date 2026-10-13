import express from "express";
import db from "../config/db.js";

const deleteTrash = express.Router();

// Supprimer toutes les tâches d'un utilisateur
deleteTrash.delete("/", (req, res) => {
  const user_id = req.query.user_id; // Récupérer user_id depuis la requête

  if (!user_id) {
    return res.status(400).json({ error: "❌ user_id est requis" });
  }

  db.query("DELETE FROM task WHERE id_user = ?", [user_id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "❌ Aucune tâche trouvée pour cet utilisateur" });
    }

    res.json({
      message: "✅ Toutes les tâches ont été supprimées avec succès",
      user_id,
    });
  });
});

export default deleteTrash;
