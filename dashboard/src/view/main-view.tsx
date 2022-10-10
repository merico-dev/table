import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { Filters } from '~/filter';
import { DashboardActions } from '~/main/actions';
import { FullScreenPanel } from '~/main/full-screen-panel';
import { usePanelFullScreen } from '~/main/use-panel-full-screen';
import { ViewModelInstance } from '..';
import { MainDashboardLayout } from './layout';

interface IMainDashboardView {
  view: ViewModelInstance;
  saveDashboardChanges: () => void;
}

export const MainDashboardView = observer(function _MainDashboardView({
  view,
  saveDashboardChanges,
}: IMainDashboardView) {
  // TODO: view-level fullsreen
  const { viewPanelInFullScreen, exitFullScreen, inFullScreen, fullScreenPanel } = usePanelFullScreen(view.panels.json);
  return (
    <DashboardActionContext.Provider
      value={{
        viewPanelInFullScreen,
        inFullScreen,
      }}
    >
      <Box className="dashboard-view">
        <Box className="dashboard-sticky-area">
          <DashboardActions saveChanges={saveDashboardChanges} />
          <Filters />
        </Box>
        {inFullScreen && <FullScreenPanel view={view} panel={fullScreenPanel!} exitFullScreen={exitFullScreen} />}
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <MainDashboardLayout view={view} isDraggable isResizable />;
      </Box>
    </DashboardActionContext.Provider>
  );
});
