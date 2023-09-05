import { Box } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { Filters } from '~/components/filter';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { ViewRenderModelInstance } from '~/model';
import { MainDashboardLayout } from './layout';
import { PreviewViewComponent } from './view-component/preview';

interface IDashboardViewEditor {
  view: ViewRenderModelInstance;
}

export const DashboardViewEditor = observer(function _DashboardViewEditor({ view }: IDashboardViewEditor) {
  return (
    <DashboardActionContext.Provider
      value={{
        viewPanelInFullScreen: _.noop,
        inFullScreen: false,
      }}
    >
      <Box className="dashboard-view" data-enable-scrollbar>
        <PreviewViewComponent view={view}>
          <Box sx={{ position: 'relative' }}>
            <Box className="dashboard-sticky-area" sx={{ position: 'sticky', top: '0px' }}>
              <Filters view={view} />
            </Box>

            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <MainDashboardLayout view={view} />
          </Box>
        </PreviewViewComponent>
      </Box>
    </DashboardActionContext.Provider>
  );
});
