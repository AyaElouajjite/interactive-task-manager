import express from "express";
import bcrypt from "bcryptjs";
import db from "../config/db.js"; // Assurez-vous d'utiliser `db` ici
import jwt from "jsonwebtoken";
const resetPassword = express.Router();

// Route pour la réinitialisation du mot de passe
resetPassword.post("/", async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hashage du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mise à jour du mot de passe dans la base de données
    const [result] = await db
      .promise()
      .query("UPDATE users SET password = ? WHERE email = ?", [
        hashedPassword,
        decoded.email,
      ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Envoyer l'email et le mot de passe pour le pré-remplissage du login
    res.json({
      message: "Mot de passe mis à jour avec succès !",
      email: decoded.email,
      newPassword: newPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

export default resetPassword;
