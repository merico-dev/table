import { LoadingOverlay } from '@mantine/core';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useDashboardStore } from '../../frames/app/models/dashboard-store-context';
import { DashboardEditor } from './dashboard-editor';
import { DashboardRebaseWarning } from './dashboard-rebase-warning';
import './index.css';
import { IDashboard } from '@devtable/dashboard';
import { observable, toJS } from 'mobx';

const LoadAndRenderDashboardEditor = observer(() => {
  const { store } = useDashboardStore();

  const state = useLocalObservable(
    () => ({
      localChanges: null as IDashboard | null,
      setLocalChanges(changes: IDashboard) {
        this.localChanges = changes;
      },
    }),
    { localChanges: observable.ref },
  );

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
      <DashboardRebaseWarning
        baseConfig={toJS(store.currentDetail.dashboard)}
        localConfig={state.localChanges ?? store.currentDetail.dashboard}
      />
      <LoadingOverlay visible={!ready} exitTransitionDuration={0} />
      {ready && (
        <DashboardEditor
          onChange={state.setLocalChanges}
          dashboardModel={store.currentDetail}
          refresh={store.loadCurrentDetail}
        />
      )}
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
