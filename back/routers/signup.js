import express from "express";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const signupRouter = express.Router();

// Route pour l'inscription
signupRouter.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const [existingUser] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insérer l'utilisateur dans la base de données
    await db
      .promise()
      .query(
        "INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)",
        [name, email, hashedPassword]
      );

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (error) {
    console.error("Erreur :", error);
    res.status(500).json({ message: "Erreur serveur, veuillez réessayer." });
  }
});

export default signupRouter;
