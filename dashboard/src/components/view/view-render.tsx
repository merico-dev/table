import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { Filters } from '~/components/filter';
import { FullScreenPanel } from '~/components/panel';
import { usePanelFullScreen } from '~/components/panel/panel-render/full-screen-render/use-panel-full-screen';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { EViewComponentType, ViewRenderModelInstance } from '~/model';
import { useFullScreenPanelContext } from '../..';
import { RenderLayout } from './layout';
import { RenderViewComponent } from './view-component/render';

interface IDashboardViewRender {
  view: ViewRenderModelInstance;
}

export const DashboardViewRender = observer(function _DashboardLayout({ view }: IDashboardViewRender) {
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
      <Box
        className="dashboard-view"
        data-enable-scrollbar
        sx={{ height: view.type === EViewComponentType.Modal ? '0 !important' : '100%' }}
      >
        {inFullScreen && <FullScreenPanel view={view} panel={fullScreenPanel!} exitFullScreen={exitFullScreen} />}
        <RenderViewComponent view={view}>
          <Box sx={{ position: 'relative' }}>
            {!inFullScreen && (
              <Box className="dashboard-sticky-area" sx={{ position: 'sticky', top: '0px' }}>
                <Filters view={view} />
              </Box>
            )}
            {!inFullScreen && <RenderLayout view={view} />}
          </Box>
        </RenderViewComponent>
      </Box>
    </DashboardActionContext.Provider>
  );
});
