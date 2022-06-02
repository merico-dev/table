import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/:id" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
