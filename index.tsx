
import React from 'react';
import ReactDOM from 'react-dom/client';
// Fix: Corrected import path for App component. The original error was due to App.tsx being a placeholder.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
