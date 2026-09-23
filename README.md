# DhaaraAI - Legal Intelligence Platform

DhaaraAI is an AI-powered legal assistant designed to help Indian citizens navigate and understand statutory laws, including the Bharatiya Nyaya Sanhita (BNS 2023), Indian Penal Code (IPC), and the Consumer Protection Act. The application provides legal information in accessible English and Hindi.

## Architecture

The project employs a modern, decoupled web architecture:
- **Frontend (`/frontend`)**: A React and Vite-based web application featuring a premium light theme with glassmorphism UI elements and responsive design.
- **Backend (`/backend`)**: A Python API powered by FastAPI. It utilizes a Retrieval-Augmented Generation (RAG) engine, integrating the Groq API for Large Language Model capabilities and ChromaDB for vector storage and semantic search.

## Setup and Installation

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- Python 3.9 or higher

### 2. Backend Configuration
The backend requires a Groq API key to process AI-driven legal queries.

1. Navigate to the `backend` directory.
2. Create or open the `.env` file.
3. Define your API key:
   ```env
   GROQ_API_KEY="your_api_key"
   ```

### 3. Running the Backend Service
Start the FastAPI server to serve the legal RAG engine:

```bash
cd backend
pip install -r requirements.txt # Ensure dependencies like fastapi, uvicorn, groq, chromadb are installed
uvicorn main:app --reload --port 8000
```
The backend API will be available at http://localhost:8000.

### 4. Running the Frontend Application
Start the Vite development server in a separate terminal session:

```bash
cd frontend
npm install
npm run dev
```
The frontend UI will be accessible at http://localhost:5173.

## Project Structure Guidelines
- **Modularity**: Code files are strictly kept under 400 lines to ensure maintainability. Large monolithic files are split into logic modules and UI sub-components.
- **Data Layer**: Legal databases, including CSVs and JSON files, are structured within the `backend/data` directory.
- **Prompts**: LLM system prompts and formatting templates are isolated in `backend/src/prompts.py` for clarity.

## Disclaimer
DhaaraAI provides general legal information and is not a substitute for professional legal counsel. Always consult a qualified advocate for legal matters.
