import React from 'react';
import ReactDOM from 'react-dom/client';
import 'lenis/dist/lenis.css';
import App from './App.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { motionEnabled } from './hooks/motion/loop';

// Set before the first render so the pinned layout applies from the first paint
document.documentElement.classList.toggle('motion', motionEnabled);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter basename="/Portfolio"> {/* basename for GitHub Pages */}
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
