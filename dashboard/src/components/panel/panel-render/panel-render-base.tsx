import { Box } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { EChartsOption } from 'echarts';
import { observer } from 'mobx-react-lite';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { usePanelVizFeatures } from '~/components/panel/panel-render/panel-viz-features';
import { PanelAddonProvider } from '~/components/plugins/panel-addon';
import { PanelContextProvider } from '~/contexts/panel-context';
import { PanelRenderModelInstance } from '~/model';
import { DescriptionPopover } from './description-popover';
import './panel-render-base.css';
import { PanelTitleBar } from './title-bar';
import { useDownloadPanelScreenshot } from './use-download-panel-screenshot';
import { PanelVizSection } from './viz';
import { LayoutStateContext } from '~/contexts';
import { doesVizRequiresData } from '../utils';
import { PanelDropdownMenu } from './panel-dropdown-menu';

function useUpdateEchartsOptions(vizType: string) {
  const [echartsOptions, setEchartsOptions] = useState<EChartsOption | null>(null);
  useEffect(() => {
    setEchartsOptions(null);
  }, [vizType]);

  return {
    echartsOptions,
    setEchartsOptions,
  };
}

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
  const { echartsOptions, setEchartsOptions } = useUpdateEchartsOptions(panel.viz.type);
  const { inEditMode } = useContext(LayoutStateContext);
  const showDropdownMenu = inEditMode || doesVizRequiresData(panel.viz.type);

  return (
    <PanelContextProvider
      value={{
        panel,
        data: panel.data,
        loading: panel.dataLoading,
        errors: panel.queryErrors,
        downloadPanelScreenshot,
        echartsOptions,
        setEchartsOptions,
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
              {showDropdownMenu && <PanelDropdownMenu>{dropdownContent}</PanelDropdownMenu>}
              <PanelTitleBar />
            </>
          )}
          <PanelVizSection panel={panel} />
        </OptionalAddon>
      </Box>
    </PanelContextProvider>
  );
});
