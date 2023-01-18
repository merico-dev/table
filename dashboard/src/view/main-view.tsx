import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { Filters } from '~/filter';
import { DashboardActions } from '~/main/actions';
import { FullScreenPanel } from '~/main/full-screen-panel';
import { usePanelFullScreen } from '~/main/use-panel-full-screen';
import { ViewModelInstance } from '..';
import { MainDashboardLayout } from './layout';
import { PreviewViewComponent } from './view-component/preview';

interface IMainDashboardView {
  view: ViewModelInstance;
  saveDashboardChanges: () => void;
  fullScreenPanelID: string;
  setFullScreenPanelID: (v: string) => void;
}

export const MainDashboardView = observer(function _MainDashboardView({
  view,
  saveDashboardChanges,
  fullScreenPanelID,
  setFullScreenPanelID,
}: IMainDashboardView) {
  const { viewPanelInFullScreen, exitFullScreen, inFullScreen, fullScreenPanel } = usePanelFullScreen(
    view,
    fullScreenPanelID,
    setFullScreenPanelID,
  );
  return (
    <DashboardActionContext.Provider
      value={{
        viewPanelInFullScreen,
        inFullScreen,
      }}
    >
      <Box
        className="dashboard-view"
        mx={-10}
        sx={{
          position: 'relative',
          height: '100%',
        }}
      >
        {inFullScreen && <FullScreenPanel view={view} panel={fullScreenPanel!} exitFullScreen={exitFullScreen} />}
        {!inFullScreen && <DashboardActions saveChanges={saveDashboardChanges} />}
        <PreviewViewComponent view={view}>
          <Box sx={{ position: 'relative' }}>
            {!inFullScreen && (
              <Box className="dashboard-sticky-area" sx={{ position: 'sticky', top: '0px' }}>
                <Filters view={view} />
              </Box>
            )}
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {!inFullScreen && <MainDashboardLayout view={view} isDraggable isResizable />}
          </Box>
        </PreviewViewComponent>
      </Box>
    </DashboardActionContext.Provider>
  );
});
