<div align="center">
  
# 🚀 CODIFY

**The Next-Generation AI-Powered Coding & Interview Platform**

[![React](https://img.shields.io/badge/React-18-blue.svg?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-purple.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-orange.svg?style=for-the-badge&logo=gemini)](https://deepmind.google/technologies/gemini/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC.svg?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

CODIFY is an innovative, intuitive, and highly interactive coding platform designed to elevate the technical interview preparation experience. By blending a professional IDE interface with advanced AI capabilities, CODIFY provides real-time problem solving, dynamic AI-led mock interviews, and seamless code execution simulations.

[Features](#-key-features) • [Tech Stack](#-technology-stack) • [Setup](#-installation--setup) • [Architecture](#-project-structure) • [Roadmap](#-future-roadmap)

</div>

---

## ✨ Key Features

### 🤖 AI-Powered Interviewer
Experience the pressure and structure of a real FAANG interview. Our Gemini AI acts as a senior engineer, guiding you through problems, providing directional hints, asking follow-up questions about time/space complexity, and evaluating your final approach.

### 💻 Professional IDE Environment
Write code in a beautifully crafted, responsive coding environment.
- **Monaco Editor Integration:** Enjoy a VS Code-like typing experience with syntax highlighting, auto-completion, and minimap support.
- **Resizable Layouts:** Customize your workspace dynamically with split-pane React Resizable Panels.
- **Multi-Language Support:** Write in JavaScript, Python, Java, or C++.

### ⚡ Intelligent Code Execution Simulation
Currently leveraging the power of **Google Gemini 3.1 Flash Lite**, the backend simulates code execution. It analyzes your logic against hidden test cases, returning compilation errors, runtime exceptions, or successful outputs complete with execution time and memory simulations.

### 🎨 Modern, Premium UI/UX
Built with a sleek dark mode by default, the UI utilizes **Tailwind CSS**, **Shadcn/UI**, and **Lucide Icons** to deliver a "wow" factor. Smooth micro-animations and intuitive navigation keep you focused on what matters: the code.

---

## 🛠 Technology Stack

**Frontend Framework & Libraries:**
- React 18 & Vite
- Tailwind CSS & Tailwind Animate
- Shadcn/UI (Radix UI primitives for accessible components)
- `@monaco-editor/react` (Code Editor)
- `react-resizable-panels` (Dynamic Layout)
- `react-markdown` & `remark-gfm` (Problem Rendering)

**Backend & Integration:**
- Node.js & Express.js
- Sequelize ORM (SQL Database structuring)
- `@google/generative-ai` (Gemini API Integration)
- `express-rate-limit` (API Security)

---

## 🚀 Installation & Setup

Follow these steps to run CODIFY locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- A Google Gemini API Key

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/codify.git
cd codify
```

### 2. Install Dependencies
Install dependencies for both the root (frontend/setup) and if applicable, specific backend structures.
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and add the necessary configuration.
```env
# Server Port
PORT=3000

# Google Gemini API Key for Code Execution Simulation & Interviewer
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Application
You can start the backend and frontend separately or together from the root.

**Option A: Running together (from root)**
```bash
npm run dev
```

**Option B: Running separately (recommended for debugging)**

*Frontend:*
```bash
cd frontend
npm run dev
```

*Backend:*
```bash
cd backend
npm run dev
```

The frontend will run on `http://localhost:8080` (Vite) and the backend on `http://localhost:3000`.

---

## 📂 Project Structure

```text
CODIFY/
├── frontend/        # Entire Frontend Application
│   ├── src/         # Reusable UI components, hooks, lib, pages
│   ├── public/      # Static assets
│   ├── index.html   # Main entry point
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/         # Entire Backend Application
│   ├── config/      # Database configuration
│   ├── data/        # Seeded coding questions & testcases
│   ├── models/      # Sequelize Schema definitions
│   ├── routes/      # Express API endpoints
│   ├── services/    # Core logic (Gemini API integration)
│   └── server.js    # Main Express server entry point (moved here)
├── scripts/         # Utility and setup scripts (e.g., Database seeding)
├── .env             # Environment variables
└── package.json     # Project metadata and root scripts
```

---

## 🗺 Future Roadmap

We are continuously evolving CODIFY to make it a **100% complete**, production-ready platform. The following major features are currently in the pipeline:

- [ ] **Robust Code Compilation Engine (Judge0 Integration)**
  Replacing the current AI-simulated code execution with a robust, sandbox-based **Judge0** API. This will allow true, native compilation and execution of user code across dozens of languages with immense security and precision.
  
- [ ] **Secure User Authentication**
  Implementing a comprehensive Login/Signup system using **Express and JSON Web Tokens (JWT)**. This will allow users to securely save their session histories, track coding progress, and maintain a historical performance dashboard.

---

<div align="center">
  <p>Built with ❤️ for developers, by developers.</p>
</div>
