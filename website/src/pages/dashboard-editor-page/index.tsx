import { observer } from 'mobx-react-lite';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useDashboardStore } from '../../frames/app/models/dashboard-store-context';
import { RebaseConfigProvider } from './content-rebase-warning/rebase-editor/rebase-config-context';
import './index.css';
import { DashboardEditorPageContent } from './page-content';
import { LoadingPlaceholder, NeedToInitializeContent } from './placeholder';
import { ContentRebaseWarning } from './content-rebase-warning';

const LoadAndRenderDashboardEditor = observer(() => {
  const { store } = useDashboardStore();

  if (!store.currentDetail) {
    return null;
  }

  const isDashboardEditable = store.currentDetail.isEditable;
  if (!isDashboardEditable) {
    return <span>TODO: redirect to index page if !isDashboardEditable</span>;
  }

  const dashboardLoading = store.detailsLoading;
  const contentLoading = store.currentDetail?.content.loading;
  if (dashboardLoading || contentLoading) {
    return <LoadingPlaceholder dashboardLoading={dashboardLoading} contentLoading={contentLoading} />;
  }
  if (!store.currentDetail?.content.fullData) {
    return <NeedToInitializeContent />;
  }

  return (
    <RebaseConfigProvider dashboardStore={store}>
      <div className="load-and-render-dashboard-editor">
        <Helmet>
          <title>{store.currentDetail.name}</title>
        </Helmet>
        <ContentRebaseWarning />
        <DashboardEditorPageContent dashboardModel={store.currentDetail} refresh={store.loadCurrentDetail} />
      </div>
    </RebaseConfigProvider>
  );
});

export function DashboardEditorPage() {
  const { id } = useParams();
  if (!id) {
    return <span>TODO: redirect to index page</span>;
  }
  return <LoadAndRenderDashboardEditor />;
}
