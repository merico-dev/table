import { Box } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { EChartsOption } from 'echarts';
import { observer } from 'mobx-react-lite';
import React, { ReactNode, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { usePanelVizFeatures } from '~/components/panel/panel-render/panel-viz-features';
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
import { PanelTopRightActions } from './top-right-actions';
import { PanelAddonProvider } from './panel-addon-context';
import { ChartControlsProvider } from './chart-controls-context';

function useUpdateEchartsOptions(vizType: string) {
  const ref = useRef<EChartsOption | null>(null);
  const setEchartsOptions = useCallback((options: EChartsOption | null) => {
    ref.current = options;
  }, []);

  useEffect(() => {
    ref.current = null;
  }, [vizType]);

  return {
    getEchartsOptions: () => ref.current,
    setEchartsOptions: setEchartsOptions,
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
  const chartControlsSlotId = `chart-controls-slot-${useId()}`;
  const panelAddonSlotId = withAddon ? `panel-addon-slot-${useId()}` : null;
  const { getEchartsOptions, setEchartsOptions } = useUpdateEchartsOptions(panel.viz.type);
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
        getEchartsOptions,
        setEchartsOptions,
      }}
    >
      <ChartControlsProvider chartControlsSlotId={chartControlsSlotId}>
        <PanelAddonProvider addonSlotId={panelAddonSlotId || undefined}>
          <Box
            id={panel.id}
            data-testid="panel-root"
            className={`panel-root ${panel.title.show ? 'panel-root--show-title' : ''}`}
            ref={ref}
            p={0}
            sx={{
              ...baseStyle,
              ...panelStyle,
            }}
          >
            {withPanelTitle && (
              <>
                <Box className="panel-description-popover-wrapper">
                  <DescriptionPopover />
                </Box>
                <PanelTitleBar />
              </>
            )}
            <PanelTopRightActions
              dropdownContent={<PanelDropdownMenu>{dropdownContent}</PanelDropdownMenu>}
              showDropdownMenu={showDropdownMenu}
              chartControlsSlotId={chartControlsSlotId}
              panelAddonSlotId={panelAddonSlotId}
            />
            <PanelVizSection panel={panel} />
          </Box>
        </PanelAddonProvider>
      </ChartControlsProvider>
    </PanelContextProvider>
  );
});
