import { AppShell, LoadingOverlay } from '@mantine/core';
import { Header } from '../components/header';
import { DashboardDemo } from './dashboard-demo';
import '@devtable/dashboard/dist/style.css';
import './index.css'
import React from 'react';

function App() {
  const [id, setID] = React.useState('');
  return (
    <AppShell
      padding="md"
      header={<Header id={id} setID={setID} />}
    >
      <LoadingOverlay visible={!id} />
      {id && <DashboardDemo id={id} />}
    </AppShell>
  )
}

export default App
