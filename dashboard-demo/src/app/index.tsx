import { AppShell } from '@mantine/core';
import { Header } from '../components/header';
import { DashboardDemo } from './dashboard-demo';
import '@devtable/dashboard/dist/style.css';
import './index.css'

function App() {
  return (
    <AppShell
      padding="md"
      header={<Header />}
    >
      <DashboardDemo />
    </AppShell>
  )
}

export default App
