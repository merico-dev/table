import { Box } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { Filters } from '~/components/filter';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { ViewRenderModelInstance } from '~/model';
import { EditLayout } from './layout';
import { PreviewViewComponent } from './view-component/preview';
import { useEditContentModelContext } from '~/contexts';

interface IDashboardViewEditor {
  view: ViewRenderModelInstance;
}

export const DashboardViewEditor = observer(function _DashboardViewEditor({ view }: IDashboardViewEditor) {
  const layoutsModel = useEditContentModelContext().layouts;
  const scaled = layoutsModel.divisionPreviewScale !== 1;
  return (
    <DashboardActionContext.Provider
      value={{
        viewPanelInFullScreen: _.noop,
        inFullScreen: false,
      }}
    >
      <Box className="dashboard-view" data-enable-scrollbar sx={{ background: scaled ? 'transparent' : '#efefef' }}>
        <PreviewViewComponent view={view}>
          <Box sx={{ position: 'relative' }}>
            <Box className="dashboard-sticky-area" sx={{ position: 'sticky', top: '0px' }}>
              <Filters view={view} />
            </Box>

            <EditLayout view={view} />
          </Box>
        </PreviewViewComponent>
      </Box>
    </DashboardActionContext.Provider>
  );
});
