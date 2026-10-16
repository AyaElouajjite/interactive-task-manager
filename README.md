# Interactive Task Manager — Application de gestion de tâches

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?logo=mysql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

Application web full-stack de gestion de tâches, composée d'une interface React en TypeScript et d'une API REST Node.js connectée à une base MySQL. Elle permet d'organiser les tâches sur un tableau Kanban, de suivre leur avancement et de consulter des statistiques.

## Fonctionnalités

- Inscription et connexion sécurisées par jeton **JWT**
- Réinitialisation du mot de passe par e-mail et changement de mot de passe
- Création, modification et suppression de tâches, avec sous-tâches et niveaux de priorité
- Tableau **Kanban** avec glisser-déposer entre les colonnes *À faire*, *En cours* et *Terminé*
- Vue en liste avec tri
- Tableau de bord statistique
- Corbeille avec restauration ou suppression définitive

## Points techniques

- Architecture client / serveur découplée communiquant via une **API REST**
- Authentification par **JWT** et hachage des mots de passe avec **bcrypt**
- Envoi d'e-mails transactionnels avec **Nodemailer**
- Gestion de l'état global avec **Redux Toolkit**
- Glisser-déposer accessible avec **dnd-kit**
- Visualisation de données avec **Recharts**
- Interface responsive construite avec **Tailwind CSS**
- Configuration externalisée par variables d'environnement

## Stack technique

| Domaine | Technologies |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Redux Toolkit, React Router, dnd-kit, Recharts, Axios |
| Backend | Node.js, Express, JSON Web Token, bcryptjs, Nodemailer |
| Base de données | MySQL |

## Architecture

```
interactive-task-manager/
├── back/                 # API REST Express
│   ├── config/db.js      # Connexion MySQL
│   ├── routers/          # Authentification, tâches, corbeille, mot de passe
│   └── index.js          # Point d'entrée du serveur
├── vite-project/         # Application React
│   └── src/
│       ├── components/   # Composants d'interface
│       ├── dnd/          # Glisser-déposer
│       ├── pages/        # Tableau de bord, tâches, corbeille, connexion
│       └── redux/        # Store et slices
└── task_manager.sql      # Schéma de la base de données
```

## Installation

**Prérequis :** Node.js 18 ou supérieur, MySQL.

**1. Base de données**

```bash
mysql -u root -p < task_manager.sql
```

**2. Backend**

```bash
cd back
npm install
```

Renseigner le fichier `back/.env` :

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_PORT=3306
DB_NAME=task
JWT_SECRET=<secret>
EMAIL_USER=<adresse e-mail>
EMAIL_PASS=<mot de passe d'application>
```

```bash
npm start
```

L'API est accessible sur `http://localhost:5000`.

**3. Frontend**

```bash
cd vite-project
npm install
npm run dev
```

L'application est accessible sur `http://localhost:3000`.

## API

| Route | Description |
|---|---|
| `/api/signup` | Inscription |
| `/api/login` | Connexion |
| `/api/tasks` | Gestion des tâches |
| `/api/trash-router` | Corbeille |
| `/api/deleteAll` | Vidage de la corbeille |
| `/api/change-password` | Changement de mot de passe |
| `/api/forgot-password` | Demande de réinitialisation |
| `/api/reset-password` | Réinitialisation du mot de passe |

## Contact

**Aya Elouajjite** — [github.com/AyaElouajjite](https://github.com/AyaElouajjite)
