import express, { query } from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const changemdpRouter = express.Router();

// Route protégée pour changer le mot de passe
changemdpRouter.put("/", async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  // Vérifier que l'utilisateur est authentifié avec un token JWT
  const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "Token manquant ou invalide" });
  }

  try {
    // Vérifier le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Rechercher l'utilisateur dans la base de données MySQL
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE id_user = ?", [decoded.id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const user = rows[0]; // Utilisateur trouvé

    // Vérifier que l'ancien mot de passe est correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe actuel incorrect" });
    }

    // Hacher le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe dans la base de données
    await db
      .promise()
      .query("UPDATE users SET password = ? WHERE id_user = ?", [
        hashedPassword,
        user.id_user,
      ]);

    // Réponse de succès

    return res.json({ message: "Mot de passe changé avec succès" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur du serveur" });
  }
});

export default changemdpRouter;
