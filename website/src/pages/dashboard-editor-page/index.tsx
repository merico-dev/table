import { LoadingOverlay } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useDashboardStore } from '../../frames/app/models/dashboard-store-context';
import { DashboardEditor } from './dashboard-editor';
import { DashboardRebaseWarning } from './dashboard-rebase-warning';
import './index.css';

const LoadAndRenderDashboardEditor = observer(() => {
  const { store } = useDashboardStore();

  if (!store.currentDetail) {
    return null;
  }

  const isDashboardEditable = store.currentDetail.isEditable;
  if (!isDashboardEditable) {
    return <span>TODO: redirect to index page if !isDashboardEditable</span>;
  }
  const ready = !store.detailsLoading;
  return (
    <div className="load-and-render-dashboard-editor">
      <Helmet>
        <title>{store.currentDetail.name}</title>
      </Helmet>
      <DashboardRebaseWarning />
      <LoadingOverlay visible={!ready} exitTransitionDuration={0} />
      {ready && <DashboardEditor dashboardModel={store.currentDetail} refresh={store.loadCurrentDetail} />}
    </div>
  );
});

export function DashboardEditorPage() {
  const { id } = useParams();
  if (!id) {
    return <span>TODO: redirect to index page</span>;
  }
  return <LoadAndRenderDashboardEditor />;
}
