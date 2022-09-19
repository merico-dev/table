import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './frames/app';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModalsProvider } from '@mantine/modals';
import './index.css';
import { DashboardPage } from './pages/dashboard-page';
import { DataSourcePage } from './pages/data-source-page';
import { AdminFrame } from './frames/admin';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ModalsProvider>
      <BrowserRouter basename={import.meta.env.VITE_WEBSITE_BASE_URL ?? ''}>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="dashboard/:id" element={<DashboardPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Route>
          <Route path="/admin" element={<AdminFrame />}>
            <Route path="data_source/list" element={<DataSourcePage />} />
            <Route path="*" element={<DataSourcePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ModalsProvider>
  </React.StrictMode>,
);
