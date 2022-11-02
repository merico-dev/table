import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './frames/app';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModalsProvider } from '@mantine/modals';
import './index.css';
import { DashboardPage } from './pages/dashboard-page';
import { DataSourcePage } from './pages/data-source-page';
import { AdminFrame } from './frames/admin';
import { AccountsPage } from './pages/account-page';
import { LoginPage } from './pages/login-page';
import { RequireAuth } from './frames/require-auth';
import { APIKeyPage } from './pages/api-key-page';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ModalsProvider>
      <BrowserRouter basename={import.meta.env.VITE_WEBSITE_BASE_URL ?? ''}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth />}>
            <Route path="/" element={<App />}>
              <Route path="dashboard/:id" element={<DashboardPage />} />
              <Route path="*" element={<DashboardPage />} />
            </Route>
            <Route path="/admin" element={<AdminFrame />}>
              <Route path="data_source/list" element={<DataSourcePage />} />
              <Route path="account/list" element={<AccountsPage />} />
              <Route path="api_key/list" element={<APIKeyPage />} />
              <Route path="*" element={<DataSourcePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ModalsProvider>
  </React.StrictMode>,
);
