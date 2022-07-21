import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { ModalsProvider } from '@mantine/modals';
import './index.css'
import { DashboardPage } from './pages/dashboard-page';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ModalsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="/dashboard/:id" element={<DashboardPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ModalsProvider>
  </React.StrictMode>
)
