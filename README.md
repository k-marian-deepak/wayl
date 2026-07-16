# WAYL Weather Web Application

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Frontend - React](https://img.shields.io/badge/Frontend-React-61DAFB?style=flat-square&logo=react&logoColor=white)](#)
[![Build - Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](#)
[![CSS - Tailwind](https://img.shields.io/badge/CSS-Tailwind-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](#)
[![Backend - FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)](#)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat-square&logo=python&logoColor=white)](#)

A modern, responsive weather dashboard built with a FastAPI backend and a React + Vite frontend. It features weather-aware themes, real-time geocoding search, interactive wind maps with Leaflet, and live weather metrics.

---

## 🚀 Running the Application (Step-by-Step)

To run the application locally, you will need to start both the **FastAPI Backend Server** (port 8080) and the **React Frontend Server** (port 5173).

---

### 1. Setup & Run the Backend API

The backend is built with Python and FastAPI. It retrieves weather forecasts from the Open-Meteo API and provides autocomplete suggestion searches.

1. **Open your terminal and navigate to the backend folder**:
   ```bash
   cd backend
   ```

2. **Create a Python virtual environment** (optional but highly recommended):
   ```bash
   python3 -m venv .venv
   ```

3. **Activate the virtual environment**:
   - On Linux/macOS:
     ```bash
     source .venv/bin/activate
     ```
   - On Windows (CMD):
     ```cmd
     .venv\Scripts\activate.bat
     ```
   - On Windows (PowerShell):
     ```powershell
     .venv\Scripts\Activate.ps1
     ```

4. **Install backend dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

5. **Start the FastAPI backend server**:
   ```bash
   uvicorn main:app --reload --port 8080
   ```

*The API server will start running at `http://127.0.0.1:8080`. You can view the automated OpenAPI documentation at `http://127.0.0.1:8080/docs`.*

---

### 2. Setup & Run the Frontend

The frontend is a React application styled with Tailwind CSS, utilizing Vite for bundling.

1. **Open a new terminal tab/window and navigate to the frontend folder**:
   ```bash
   cd frontend
   ```

2. **Install Node dependencies**:
   ```bash
   npm install
   ```

3. **Start the React dev server**:
   ```bash
   npm run dev
   ```

*The frontend development server will spin up. Open your browser and navigate to `http://localhost:5173/` to view the application.*

---

## 🛠️ Tech Stack & Key Libraries

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Leaflet (Map Container), Recharts (Live Curve)
- **Backend**: FastAPI, Uvicorn, HTTPX (async fetching), Requests

---

## ⚙️ CI/CD Pipeline (Jenkins)

The project includes a `Jenkinsfile` to automate building, archiving, and deploying.

### Branch & Pull Request Rules
The pipeline compiles code on any push or pull request event, managing deployments and checks dynamically:
* **`main`**: Automated production build, archive, and deployment.
* **`fix-*` (e.g., `fix-build-permissions`)**: Wildcard hotfix branches. Builds are compiled, archived, and deployed for staging validation.
* **Pull Requests (PRs)**: Automatically triggers the **PR Merge Verification** stage to validate pre-merge safety, compiling and archiving the code. The `Deploy` stage is safely disabled for PR previews to ensure code is only deployed once it is formally merged into the target branch.
* **Other Development Branches**: Full compilation and archiving to verify syntax correctness, skipping the validation and deployment stages.

### Pipeline Stages
1. **Checkout**: Pulls the active branch or the PR merge preview commit from Git.
2. **Build Frontend**: Navigates to `/frontend`, runs `npm install` (with local offline caching), and builds the static assets.
3. **Archive Build Artifacts**: Saves the `frontend/dist/` build output inside the Jenkins build history for access.
4. **PR Merge Verification**: Runs only when a Pull Request is opened or updated, printing metadata about the source/target branches and verifying integration.
5. **Deploy**: Runs for `main` and `fix-*` branches (excluding pull request previews) to deploy compiled files.

