import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PanelModelInstance } from '~/dashboard-editor/model/panels';
import { ViewMetaInstance } from '~/model';
import { PanelContextProvider } from '~/contexts/panel-context';
import { DescriptionPopover } from '../panel-render/description-popover';
import { PanelDropdownMenu } from '../panel-render/dropdown-menu';
import { PanelVizSection } from '../panel-render/viz/panel-viz-section';
import { PanelTitleBar } from '../panel-render/title-bar';
import '../panel-render/panel-render.css';

interface IPanel {
  view: ViewMetaInstance;
  panel: PanelModelInstance;
}

const constantBorder = {
  border: '1px solid #e9ecef',
};
const hoverBorder = {
  border: '1px dashed transparent',
  transition: 'border-color 300ms ease',
  '&:hover': {
    borderColor: '#e9ecef',
  },
};

function getPanelBorderStyle(panel: PanelModelInstance) {
  if (panel.style.border.enabled) {
    return constantBorder;
  }

  return hoverBorder;
}

export const Panel = observer(function _Panel({ panel, view }: IPanel) {
  const contentHeight = !panel.title ? '100%' : 'calc(100% - 25px - 5px)';
  const panelStyle = getPanelBorderStyle(panel);
  return (
    <PanelContextProvider value={{ panel, data: panel.data, loading: panel.dataLoading, errors: panel.queryErrors }}>
      <Box
        className="panel-root"
        p={5}
        pt={0}
        sx={{
          ...panelStyle,
        }}
      >
        <Box sx={{ position: 'absolute', left: 0, top: 0, height: 28, zIndex: 310 }}>
          <DescriptionPopover />
        </Box>
        <PanelDropdownMenu view={view} />
        <PanelTitleBar />
        <PanelVizSection panel={panel} height={contentHeight} />
      </Box>
    </PanelContextProvider>
  );
});
