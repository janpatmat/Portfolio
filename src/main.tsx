import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import { BrowserRouter, Route, Routes } from 'react-router';  // Use 'react-router-dom' instead of 'react-router'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
