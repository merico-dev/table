import { Box } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { Filters } from '~/filter';
import { DashboardActions } from '~/main/actions';
import { FullScreenPanel } from '~/main/full-screen-panel';
import { usePanelFullScreen } from '~/main/use-panel-full-screen';
import { useStickyAreaStyle } from '~/main/use-sticky-area-style';
import { ViewModelInstance } from '..';
import { ReadOnlyDashboardLayout } from './layout';

interface IReadOnlyDashboardView {
  view: ViewModelInstance;
  fullScreenPanelID: string;
  setFullScreenPanelID: (v: string) => void;
}

export const ReadOnlyDashboardView = observer(function _DashboardLayout({
  view,
  fullScreenPanelID,
  setFullScreenPanelID,
}: IReadOnlyDashboardView) {
  const { viewPanelInFullScreen, exitFullScreen, inFullScreen, fullScreenPanel } = usePanelFullScreen(
    view,
    fullScreenPanelID,
    setFullScreenPanelID,
  );
  useStickyAreaStyle();
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
        {!inFullScreen && (
          <Box className="dashboard-sticky-area">
            <DashboardActions saveChanges={_.noop} />
            <Filters view={view} />
          </Box>
        )}
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        {!inFullScreen && <ReadOnlyDashboardLayout view={view} />}
      </Box>
    </DashboardActionContext.Provider>
  );
});
