# evaluify: AI-Powered Assessment Platform

**evaluify** is a comprehensive, modern web application designed for creating, managing, and taking online assessments in a secure, AI-proctored environment. It serves various user roles, including instructors, corporate hiring managers, training companies, platform administrators, and examinees, each with a tailored dashboard and feature set.

![Platform Screenshot](https://placehold.co/800x450/14b8a6/white?text=evaluify%20Platform)

## ✨ Key Features

- **Multi-Role Architecture**: Dedicated dashboards and permissions for different user types (Teacher, Corporate, Admin, Examinee, etc.).
- **AI-Powered Tools (Google Gemini)**:
  - **Dynamic Question & Exam Generation**: Instantly create full exams or individual questions from a topic.
  - **AI Proctoring**: Monitors users during exams for integrity flags (tab switching, noise, face detection).
  - **CV / Resume Analysis**: Automatically scores resumes against job descriptions and suggests interview questions.
  - **AI Assistant**: An in-app chatbot to help users navigate the platform and get information.
  - **Smart Reports**: Generates high-level summaries and actionable insights from assessment data.
- **Comprehensive Assessment Tools**:
  - **Versatile Test Builder**: Supports multiple question types (MCQ, Essay, Ordering, Matching, etc.).
  - **Centralized Question Banks**: Manage personal, corporate, or platform-wide question repositories.
- **Advanced Analytics & Reporting**: Visualizes performance data with interactive charts and generates detailed PDF reports.
- **Live Video Interviews**: Integrated live interview functionality with AI assistance using the Jitsi Meet API.
- **Modern User Experience**:
  - **Responsive Design**: Fully functional on all screen sizes.
  - **Light & Dark Modes**: User-selectable themes for comfort.
  - **Bilingual Support**: Seamlessly switch between English and Arabic (RTL support).
  - **Real-time Notifications**: In-app success and error notifications.
- **Developer-Friendly**:
  - **Component-Based Architecture**: Built with reusable React components.
  - **Role Switcher Tool**: A development tool for easily testing different user roles.
  - **Type-Safe**: Written in TypeScript for enhanced code quality and maintainability.

## 🚀 Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **AI Integration**: [Google Gemini API](https://ai.google.dev/docs/gemini_api_overview) (`@google/genai`)
- **Routing**: [React Router](https://reactrouter.com/) v6
- **Charting**: [Chart.js](https://www.chartjs.org/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) & `jspdf-autotable`
- **Video Conferencing**: [Jitsi Meet External API](https://jitsi.github.io/handbook/docs/dev-guide/dev-guide-iframe)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 🔧 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Environment Variables

The application requires a Google Gemini API key to function.

1.  Create a `.env` file in the root of the project.
2.  Add your API key to the file:

    ```
    API_KEY=your_google_gemini_api_key_here
    ```

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd evaluify-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## 📂 Project Structure

The `src` directory is organized as follows:

```
src/
├── components/       # Reusable UI components (modals, cards, icons, etc.)
│   ├── auth/
│   ├── candidates/
│   ├── dashboard/
│   ├── kanban/
│   └── skeletons/
├── contexts/         # React Context for global state (Auth, DarkMode, etc.)
├── hooks/            # Custom React hooks (e.g., useNavLinks)
├── pages/            # Top-level page components for each route
│   └── shared/       # Shared page components used by multiple roles
├── services/         # API-related logic (mockApi.ts, geminiService.ts)
├── types.ts          # Centralized TypeScript type definitions
├── App.tsx           # Main application component with routing logic
└── index.tsx         # Application entry point
```

## 📜 Available Scripts

In the project directory, you can run:

-   `npm run dev`: Starts the development server with Hot Module Replacement.
-   `npm run build`: Bundles the app for production.
-   `npm run preview`: Serves the production build locally for testing.

## 🏛️ Architectural Notes

-   **Role-Based Access Control (RBAC)**: The application uses a `ProtectedRoute` component that checks the user's role from `AuthContext` to control access to different pages and features.
-   **Shared Components**: To avoid code duplication, pages used by multiple roles (e.g., Assessments, Analytics) have been refactored into a `pages/shared` directory. Router components like `AssessmentsRouter` then render the correct version of the shared page with role-specific props.
-   **Mock API**: All backend interactions are simulated in `src/services/mockApi.ts`. This allows for rapid frontend development and testing without a live backend.
-   **Centralized Gemini Client**: The Google Gemini AI client is initialized as a singleton in `src/services/geminiService.ts` to ensure a single, efficient instance is used throughout the app.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
