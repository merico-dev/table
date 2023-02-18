import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { Filters } from '~/filter';
import { DashboardActions } from '~/view/dashboard-actions';
import { FullScreenPanel } from '~/main/full-screen-panel';
import { usePanelFullScreen } from '~/main/use-panel-full-screen';
import { useFullScreenPanelContext, ViewModelInstance } from '..';
import { MainDashboardLayout } from './layout';
import { PreviewViewComponent } from './view-component/preview';

interface IDashboardViewEditor {
  view: ViewModelInstance;
  saveDashboardChanges: () => void;
}

export const DashboardViewEditor = observer(function _DashboardViewEditor({
  view,
  saveDashboardChanges,
}: IDashboardViewEditor) {
  const { fullScreenPanelID, setFullScreenPanelID } = useFullScreenPanelContext();
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
      <Box className="dashboard-view" data-enable-scrollbar>
        {inFullScreen && <FullScreenPanel view={view} panel={fullScreenPanel!} exitFullScreen={exitFullScreen} />}
        {!inFullScreen && <DashboardActions saveChanges={saveDashboardChanges} inUseMode={false} />}
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
