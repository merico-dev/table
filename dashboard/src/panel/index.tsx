import { Box, Flex, LoadingOverlay } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { ViewModelInstance } from '~/model';
import { PanelModelInstance } from '~/model/panels';
import { LayoutStateContext } from '../contexts';
import { PanelContextProvider } from '../contexts/panel-context';
import './index.css';
import { DescriptionPopover } from './panel-description';
import { PanelDropdownMenu } from './panel-dropdown-menu';
import { PanelTitleBar } from './title-bar';
import { Viz } from './viz';
import { PanelErrorOrStateMessage } from './panel-error-or-state-message';
import { PanelVizSection } from './panel-viz-section';

function doesVizRequiresData(type: string) {
  const vizTypes = ['richText', 'button'];
  return !vizTypes.includes(type);
}

interface IPanel {
  view: ViewModelInstance;
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

function getPanelBorderStyle(panel: PanelModelInstance, inEditMode: boolean) {
  if (panel.style.border.enabled) {
    return constantBorder;
  }
  if (inEditMode) {
    return hoverBorder;
  }
  return { border: '1px dashed transparent' };
}

export const Panel = observer(function _Panel({ panel, view }: IPanel) {
  const { inEditMode } = useContext(LayoutStateContext);

  const contentHeight = !panel.title ? '100%' : 'calc(100% - 25px - 5px)';
  const panelStyle = getPanelBorderStyle(panel, inEditMode);
  const needDropdownMenu = inEditMode;
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
        {needDropdownMenu && <PanelDropdownMenu view={view} />}
        <PanelTitleBar />
        <PanelVizSection panel={panel} height={contentHeight} />
      </Box>
    </PanelContextProvider>
  );
});
