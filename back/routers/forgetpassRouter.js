import express from "express";
import db from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"; // Import manquant
const forgetpassRouter = express.Router();

// Route pour mot de passe oublié
forgetpassRouter.post("/", async (req, res) => {
  const { email } = req.body;

  try {
    // Vérification de l'utilisateur
    const [rows] = await db
      .promise()
      .query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      console.log("Utilisateur non trouvé !");
      return res.status(404).json({ message: "Utilisateur non trouvé !" });
    }

    // Générer un token JWT valide pendant 1 heure
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Lien de réinitialisation
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    console.log(`Lien de réinitialisation : ${resetLink}`);

    // Configurer le service d'e-mail avec mot de passe d'application
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // Ne pas utiliser TLS, utilise STARTTLS à la place
      auth: {
        user: process.env.EMAIL_USER, // Ton email Gmail
        pass: process.env.EMAIL_PASS, // Ton mot de passe d'application Gmail
      },
    });

    // Envoi de l'email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Réinitialisation de mot de passe",
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetLink}`,
    });

    res.json({ message: "✅ Lien de réinitialisation envoyé par email." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "❌ Erreur interne du serveur." });
  }
});

export default forgetpassRouter;
