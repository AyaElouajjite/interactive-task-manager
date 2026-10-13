import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import signupRouter from "./routers/signup.js";
import authRouter from "./routers/auth.js";
import tasksRouter from "./routers/tasks.js";
import changemdpRouter from "./routers/changemdpRouter.js";
import forgetpassRouter from "./routers/forgetpassRouter.js";
import trashRouter from "./routers/trashRouter.js";
import deleteTrash from "./routers/deleteTrash.js";
import resetPassword from "./routers/resetPassword.js";
// Charger les variables d'environnement du fichier .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000; // Utilise la variable PORT

// Middleware pour parser le JSON
app.use(express.json());

// Activer CORS pour autoriser le frontend (React)
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Routes
app.use("/api/signup", signupRouter); // Activation des routes d'authentification
app.use("/api/login", authRouter); // Activation des routes d'authentification
app.use("/api/tasks", tasksRouter); // Activer la route des tâches
app.use("/api/change-password", changemdpRouter); // Changer password
app.use("/api/forgot-password", forgetpassRouter); // Changer password
app.use("/api/trash-router", trashRouter); // trash router
app.use("/api/deleteAll", deleteTrash); // tdelete all trash
app.use("/api/reset-password", resetPassword); // reset-password
// Route de test
app.get("/", (req, res) => {
  res.send(`✅ Serveur démarré sur le port ${port}`);
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`🚀 Serveur démarré sur le port ${port}`);
});
