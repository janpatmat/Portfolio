import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import ProjectPage from './pages/ProjectPage/ProjectPage.tsx';
import { BrowserRouter, Route, Routes } from 'react-router';  // Use 'react-router-dom' instead of 'react-router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<ProjectPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
