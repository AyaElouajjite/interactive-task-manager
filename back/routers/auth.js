import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js"; // Connexion database

const authRouter = express.Router();

// Route de connexion (Login)
authRouter.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis" });
  }

  // Vérifier si l'utilisateur existe
  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Erreur de la base de données" });

      if (results.length === 0) {
        return res.status(400).json({ message: "Utilisateur non trouvé" });
      }

      const user = results[0];

      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }

      // Générer un token JWT
      const token = jwt.sign(
        { id: user.id_user, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );

      res.status(200).json({
        message: "Connexion réussie",
        user: { id: user.id_user, name: user.full_name, email: user.email },
        token,
      });
    }
  );
});

export default authRouter;
