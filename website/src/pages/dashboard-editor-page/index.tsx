import { LoadingOverlay } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { useDashboardDetailQuery } from '../../frames/app/models/dashboard-store';
import { DashboardEditor } from './dashboard-editor';
import { DashboardRebaseWarning } from './dashboard-rebase-warning';
import './index.css';

const LoadAndRenderDashboardEditor = observer(({ id }: { id: string }) => {
  const { data: dashboardModel, loading, refresh } = useDashboardDetailQuery({ id });

  if (!dashboardModel) {
    return null;
  }

  const isDashboardEditable = dashboardModel.isEditable;
  if (!isDashboardEditable) {
    return <span>TODO: redirect to index page if !isDashboardEditable</span>;
  }
  const ready = !loading;
  return (
    <div className="load-and-render-dashboard-editor">
      <DashboardRebaseWarning id={id} current={dashboardModel} />
      <LoadingOverlay visible={!ready} exitTransitionDuration={0} />
      {ready && <DashboardEditor dashboardModel={dashboardModel} refresh={refresh} />}
    </div>
  );
});

export function DashboardEditorPage() {
  const { id } = useParams();
  if (!id) {
    return <span>TODO: redirect to index page</span>;
  }
  return <LoadAndRenderDashboardEditor id={id} />;
}
