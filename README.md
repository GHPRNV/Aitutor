# CodeMentor AI 🧠💻

CodeMentor AI is an intelligent, agentic coding tutor built for the RVITM Hackathon 2026. It goes beyond simple code generation by using Socratic dialogue, progressive hints, and live execution tracing to actually *teach* programming concepts.

## 🌟 Features

- **Progressive Hints**: Instead of giving away the answer, CodeMentor offers 5 levels of hints, from conceptual nudges to targeted logic fixes.
- **Socratic Teaching**: The AI asks guiding questions to help you arrive at the solution yourself.
- **Live Code Execution**: Features a built-in Python sandbox via Gemini's Code Execution tool. Run your code against visible and hidden test cases instantly.
- **Execution Tracing**: Visually step through your code to see exactly how variables change line-by-line during runtime.
- **Misconception Detection**: The system identifies underlying misunderstandings (e.g., confusing index vs. value) and addresses the root concept.
- **Deterministic Scoring & Dashboard**: A local tracking engine monitors your problem-solving accuracy, current streak, and concept mastery, automatically recommending targeted practice for weak areas.

## 🛠️ Technologies Used

- **Framework**: [Next.js 15.5 LTS](https://nextjs.org/) (React framework for the web)
- **AI Agent Orchestration**: [Firebase Genkit](https://firebase.google.com/docs/genkit) (v1.42.0)
- **Language Models**: Google Gemini 3.8 Flash (via `@genkit-ai/google-genai`)
- **Code Execution**: Native Gemini Python Code Execution Sandbox (No Docker required)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/) (The engine behind VS Code)
- **Styling**: Tailwind CSS v4 + Lucide React Icons
- **Storage**: `localStorage` for rapid, database-free hackathon prototyping (Firebase Auth/Firestore is supported optionally)

## 🚀 How to Run Locally

### 1. Install Dependencies
Make sure you are in the project root directory (`d:\rvitmhack`) and install the required NPM packages:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment file to create your local config:
```bash
cp .env.example .env.local
```
Open `.env.local` and add your Gemini API Key. You can get a free key from [Google AI Studio](https://aistudio.google.com/app/apikey).
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 3. Start the Development Server
Run the Next.js development server:
```bash
npm run dev
```

### 4. Open the App
Navigate to [http://localhost:3000](http://localhost:3000) in your web browser. 

You can start by clicking **"Start Learning"** on the landing page, selecting a problem like **"Find Largest Element"**, and interacting with the AI Tutor in the workspace!
