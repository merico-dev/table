import { Box, Sx } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { PanelContextProvider } from '~/contexts/panel-context';
import { PanelRenderModelInstance } from '~/model';
import { DescriptionPopover } from './description-popover';
import './panel-render-base.css';
import { PanelTitleBar } from './title-bar';
import { useDownloadPanelScreenshot } from './use-download-panel-screenshot';
import { PanelVizSection } from './viz';

interface IPanelBase {
  panel: PanelRenderModelInstance;
  dropdownContent?: ReactNode;
  panelStyle: Sx;
}

const baseStyle: Sx = { border: '1px solid #e9ecef' };

export const PanelRenderBase = observer(({ panel, panelStyle, dropdownContent }: IPanelBase) => {
  const { ref, downloadPanelScreenshot } = useDownloadPanelScreenshot(panel);
  const contentHeight = !panel.title ? '100%' : 'calc(100% - 25px - 5px)';
  return (
    <PanelContextProvider
      value={{
        panel,
        data: panel.data,
        loading: panel.dataLoading,
        errors: panel.queryErrors,
        downloadPanelScreenshot,
      }}
    >
      <Box
        className="panel-root"
        ref={ref}
        p={5}
        pt={0}
        sx={{
          ...baseStyle,
          ...panelStyle,
        }}
      >
        <Box sx={{ position: 'absolute', left: 0, top: 0, height: 28, zIndex: 310 }}>
          <DescriptionPopover />
        </Box>
        {dropdownContent}
        <PanelTitleBar />
        <PanelVizSection panel={panel} height={contentHeight} />
      </Box>
    </PanelContextProvider>
  );
});
