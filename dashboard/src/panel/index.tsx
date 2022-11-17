import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import { PanelModelInstance } from '~/model/views/view/panels';
import { ViewModelInstance } from '..';
import { LayoutStateContext, useModelContext } from '../contexts';
import { PanelContextProvider } from '../contexts/panel-context';
import './index.css';
import { DescriptionPopover } from './panel-description';
import { PanelDropdownMenu } from './panel-dropdown-menu';
import { PanelTitleBar } from './title-bar';
import { Viz } from './viz';

function doesVizRequiresData(type: string) {
  const vizTypes = ['richText'];
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

function getPanelBorderStyle(panel: PanelModelInstance, panelNeedData: boolean, inEditMode: boolean) {
  if (panel.style.border.enabled) {
    return constantBorder;
  }
  if (inEditMode) {
    return hoverBorder;
  }
  if (panelNeedData) {
    return hoverBorder;
  }
  return { border: '1px dashed transparent' };
}

export const Panel = observer(function _Panel({ panel, view }: IPanel) {
  const model = useModelContext();
  const { inEditMode } = useContext(LayoutStateContext);

  const { data, state, error } = model.getDataStuffByID(panel.queryID);
  const panelNeedData = doesVizRequiresData(panel.viz.type);
  const loading = panelNeedData && state === 'loading';

  const vizHeight = !panel.title ? '100%' : 'calc(100% - 25px - 5px)';
  const panelStyle = getPanelBorderStyle(panel, panelNeedData, inEditMode);
  const needDropdownMenu = panelNeedData || inEditMode;
  return (
    <PanelContextProvider value={{ panel, data, loading }}>
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
        <Viz viz={panel.viz} data={data} loading={loading} error={error} height={vizHeight} />
      </Box>
    </PanelContextProvider>
  );
});
