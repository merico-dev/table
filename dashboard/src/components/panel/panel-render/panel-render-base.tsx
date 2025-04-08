import { Box } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { observer } from 'mobx-react-lite';
import React, { ReactNode } from 'react';
import { PanelAddonProvider } from '~/components/plugins/panel-addon';
import { PanelContextProvider } from '~/contexts/panel-context';
import { PanelRenderModelInstance } from '~/model';
import { DescriptionPopover } from './description-popover';
import './panel-render-base.css';
import { PanelTitleBar } from './title-bar';
import { useDownloadPanelScreenshot } from './use-download-panel-screenshot';
import { PanelVizSection } from './viz';
import { usePanelVizFeatures } from '~/components/panel/panel-render/panel-viz-features';

interface IPanelBase {
  panel: PanelRenderModelInstance;
  dropdownContent?: ReactNode;
  panelStyle: EmotionSx;
}

const baseStyle: EmotionSx = { border: '1px solid #e9ecef' };

export const PanelRenderBase = observer(({ panel, panelStyle, dropdownContent }: IPanelBase) => {
  const { ref, downloadPanelScreenshot } = useDownloadPanelScreenshot(panel);
  const { withAddon, withPanelTitle } = usePanelVizFeatures();
  const OptionalAddon = withAddon ? PanelAddonProvider : React.Fragment;
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
        id={panel.id}
        className={`panel-root ${panel.title.show ? 'panel-root--show-title' : ''}`}
        ref={ref}
        p={0}
        sx={{
          ...baseStyle,
          ...panelStyle,
        }}
      >
        <OptionalAddon>
          {withPanelTitle && (
            <>
              <Box className="panel-description-popover-wrapper">
                <DescriptionPopover />
              </Box>
              {dropdownContent}
              <PanelTitleBar />
            </>
          )}
          <PanelVizSection panel={panel} />
        </OptionalAddon>
      </Box>
    </PanelContextProvider>
  );
});
