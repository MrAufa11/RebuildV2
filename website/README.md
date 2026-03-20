# RebuildV2 Website Project

This repository contains the source code for the RebuildV2 Website, structured as a monorepo with separate `backend` and `frontend` directories.

## Project Structure

- **backend**: Node.js/Express API with Sequelize ORM.
- **frontend**: Vue 3 application built with Vite and TailwindCSS.

## Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/)
- [MySQL](https://www.mysql.com/)

---

## 🚀 Getting Started

### 1. Backend Setup

The backend handles the API logic and database interactions.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    - Copy the example environment file:
      ```bash
      cp .env.example .env
      ```
    - Open `.env` and configure your database credentials (`DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`).

4.  Database Setup:
    - Create the database (if not already created matching `DB_NAME` in `.env`).
    - Run migrations to create tables:
      ```bash
      npx sequelize-cli db:migrate
      ```
    - (Optional) Seed the database with initial data:
      ```bash
      npx sequelize-cli db:seed:all
      ```

5.  Start the Development Server:
    ```bash
    npm run dev
    ```
    The server typically runs on `http://localhost:3000` (or the port defined in `.env`).

### 2. Frontend Setup

The frontend is the user interface built with Vue 3.

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    - Create a `.env` file in the `frontend` root if needed.
    - Define variables likely used for API connection (e.g., `VITE_API_URL=http://localhost:3000`).

4.  Start the Development Server:
    ```bash
    npm run dev
    ```
    The application will be accessible at the URL shown in the terminal (usually `http://localhost:5173`).

---

## 📜 Scripts

### Backend
- `npm start`: Runs the server with Node.
- `npm run dev`: Runs the server with Nodemon (auto-restart on changes).

### Frontend
- `npm run dev`: Starts the Vite development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.

## License

This project is licensed under the ISC License.
