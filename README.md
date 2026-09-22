# LegalGPT (DhaaraAI) - Minor Project

Welcome to **LegalGPT**, an AI-powered legal assistant designed to help the common Indian citizen (Aam Bhartiya Nagrik) easily search and understand Indian statutory laws (like IPC, BNS, Consumer Protection Act, Constitution) in simple Hindi and English.

This project uses a modern web architecture separated into a fast **React/Vite Frontend** and a powerful **FastAPI Backend**.

---

## 🛠️ Folder Structure

- `/frontend` - The beautiful web application built with React, Vite, and Vanilla CSS (Glassmorphism & Light Theme).
- `/backend` - The Python API built with FastAPI that runs the RAG (Retrieval-Augmented Generation) engine utilizing the `Groq` API and ChromaDB.

---

## 🚀 How to Setup and Run

### 1. Configure the AI (Groq API Key)
To enable the AI to generate answers, you need to add your Groq API key:
1. Open the file located at `backend/.env` (I have already created it for you).
2. Paste your API key in that file like this:
   ```env
   GROQ_API_KEY="your_actual_api_key_here"
   ```

### 2. Start the Backend API
The backend serves the legal RAG engine to the frontend.
Open a terminal and run:
```bash
cd backend
pip install fastapi uvicorn
uvicorn main:app --reload --port 8000
```
*The backend will be running at http://localhost:8000*

### 3. Start the Web App (Frontend)
The frontend is the beautifully designed user interface.
Open a **new, separate terminal** and run:
```bash
cd frontend
npm install
npm run dev
```
*The frontend will be running at http://localhost:5173*

### 4. Use the App
Open your browser and navigate to [http://localhost:5173](http://localhost:5173). You can now ask questions in English or Hindi!

---

## 👨‍💻 Project Guidelines & Features
- **UI Design**: A premium light theme utilizing glassmorphism and dynamic animations.
- **Modularity**: Code files are strictly kept concise (200-400 lines max) to ensure readability and maintainability.
- **Database**: All legal databases (CSVs, JSONs) are neatly arranged within the `backend/data` directory.
