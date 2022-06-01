import { AppShell, LoadingOverlay, MantineProvider } from '@mantine/core';
import { Header } from '../components/header';
import { DashboardDemo } from './dashboard-demo';
import '@devtable/dashboard/dist/style.css';
import './index.css'
import React from 'react';
import { NotificationsProvider } from '@mantine/notifications';

function App() {
  const [id, setID] = React.useState('');
  return (
    <AppShell
      padding="md"
      header={<Header id={id} setID={setID} />}
    >
      <LoadingOverlay visible={!id} />
      <MantineProvider>
        <NotificationsProvider>
          {id && <DashboardDemo id={id} />}
        </NotificationsProvider>
      </MantineProvider>
    </AppShell>
  )
}

export default App
