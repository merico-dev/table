import { useParams } from 'react-router-dom';
import { DashboardPageContent } from './content';
import { PleaseChooseADashboard } from "./placeholder"

export function DashboardPage() {
  const { id } = useParams()
  if (!id) {
    return <PleaseChooseADashboard />
  }
  return (
    <DashboardPageContent id={id} />
  )
}