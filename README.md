# ✅ Interactive Task Manager — Gestionnaire de tâches interactif

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

Application web **full-stack** de gestion de tâches : création, organisation par glisser-déposer, suivi de l'avancement et tableau de bord statistique.

---

## ✨ Fonctionnalités

- 🔐 **Authentification** : inscription, connexion par **JWT**, mots de passe chiffrés (bcrypt)
- 🔑 **Mot de passe oublié** : réinitialisation par e-mail (Nodemailer) et changement de mot de passe
- 📝 **Gestion des tâches** : création, modification, sous-tâches, priorités (haute / moyenne / basse)
- 🗂️ **Vue tableau (Kanban)** avec **glisser-déposer** entre les colonnes *À faire*, *En cours* et *Terminé*
- 📋 **Vue liste** et tri des tâches
- 📊 **Tableau de bord** avec graphiques (Recharts)
- 🗑️ **Corbeille** : restauration ou suppression définitive des tâches
- 🔔 Notifications et retours visuels (Sonner)

## 🛠️ Technologies

| Couche | Outils |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Router, dnd-kit, Recharts, Axios |
| Backend | Node.js, Express, JWT, bcryptjs, Nodemailer |
| Base de données | MySQL |

## 🏗️ Architecture

```
interactive-task-manager/
├── back/                 # API REST Express
│   ├── config/db.js      # Connexion MySQL
│   ├── routers/          # Routes : auth, signup, tasks, trash, mot de passe…
│   └── index.js          # Point d'entrée du serveur
├── vite-project/         # Application React
│   └── src/
│       ├── components/   # Composants UI (BoardView, TaskCard, Chart…)
│       ├── dnd/          # Glisser-déposer
│       ├── pages/        # Dashboard, tâches, corbeille, connexion…
│       └── redux/        # Store et slices
└── task_manager.sql      # Script de création de la base
```

## 🚀 Installation

**Prérequis :** Node.js 18+, MySQL

### 1. Base de données

Importer le fichier `task_manager.sql` dans MySQL (via phpMyAdmin ou en ligne de commande) :

```bash
mysql -u root -p < task_manager.sql
```

### 2. Backend

```bash
cd back
npm install
```

Configurer le fichier `back/.env` :

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_PORT=3306
DB_NAME=task
JWT_SECRET=votre_secret
EMAIL_USER=votre_adresse@gmail.com
EMAIL_PASS=votre_mot_de_passe_application
```

```bash
npm start
```

L'API démarre sur **http://localhost:5000**.

### 3. Frontend

```bash
cd vite-project
npm install
npm run dev
```

L'application est disponible sur **http://localhost:3000**.

## 🔌 Principales routes de l'API

| Route | Description |
|---|---|
| `/api/signup` | Inscription |
| `/api/login` | Connexion (JWT) |
| `/api/tasks` | CRUD des tâches |
| `/api/trash-router` | Corbeille |
| `/api/deleteAll` | Vider la corbeille |
| `/api/change-password` | Changer le mot de passe |
| `/api/forgot-password` | Demande de réinitialisation |
| `/api/reset-password` | Réinitialisation du mot de passe |

## 👩‍💻 Auteur

**Aya Elouajjite** — [@AyaElouajjite](https://github.com/AyaElouajjite)
