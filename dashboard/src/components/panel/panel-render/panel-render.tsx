import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PanelContextProvider } from '~/contexts/panel-context';
import { PanelRenderModelInstance, ViewMetaInstance } from '~/model';
import { DescriptionPopover } from './description-popover';
import { PanelDropdownMenu } from './dropdown-menu';
import './panel-render.css';
import { PanelTitleBar } from './title-bar';
import { PanelVizSection } from './viz';

interface IPanel {
  view: ViewMetaInstance;
  panel: PanelRenderModelInstance;
}

const constantBorder = {
  border: '1px solid #e9ecef',
};

function getPanelBorderStyle(panel: PanelRenderModelInstance) {
  if (panel.style.border.enabled) {
    return constantBorder;
  }
  return { border: '1px dashed transparent' };
}

export const PanelRender = observer(({ panel, view }: IPanel) => {
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
