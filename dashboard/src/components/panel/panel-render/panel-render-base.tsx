import { Box } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';
import { PanelContextProvider } from '~/contexts/panel-context';
import { PanelAddonProvider } from '~/components/plugins/panel-addon';
import { PanelRenderModelInstance } from '~/model';
import { DescriptionPopover } from './description-popover';
import './panel-render-base.css';
import { PanelTitleBar } from './title-bar';
import { useDownloadPanelScreenshot } from './use-download-panel-screenshot';
import { PanelVizSection } from './viz';

interface IPanelBase {
  panel: PanelRenderModelInstance;
  dropdownContent?: ReactNode;
  panelStyle: EmotionSx;
}

const baseStyle: EmotionSx = { border: '1px solid #e9ecef' };

export const PanelRenderBase = observer(({ panel, panelStyle, dropdownContent }: IPanelBase) => {
  const { ref, downloadPanelScreenshot } = useDownloadPanelScreenshot(panel);
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
        className={`panel-root ${panel.title.show ? 'panel-root--show-title' : ''}`}
        ref={ref}
        p={0}
        sx={{
          ...baseStyle,
          ...panelStyle,
        }}
      >
        <PanelAddonProvider>
          <Box className="panel-description-popover-wrapper">
            <DescriptionPopover />
          </Box>
          {dropdownContent}
          <PanelTitleBar />
          <PanelVizSection panel={panel} />
        </PanelAddonProvider>
      </Box>
    </PanelContextProvider>
  );
});
