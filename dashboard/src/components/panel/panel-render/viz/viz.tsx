import { useElementSize } from '@mantine/hooks';
import { get } from 'lodash';
import { createPortal } from 'react-dom';

import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode, useContext, useEffect } from 'react';
import { useConfigVizInstanceService } from '~/components/panel/use-config-viz-instance-service';
import {
  ServiceLocatorProvider,
  useServiceLocator,
} from '~/components/plugins/service/service-locator/use-service-locator';
import { WidthAndHeight } from '~/components/plugins/viz-manager/components';
import { ErrorBoundary } from '~/utils';
import { usePanelAddonSlot } from '~/components/plugins/panel-addon';
import { LayoutStateContext, useRenderPanelContext } from '../../../../contexts';
import { IViewPanelInfo, PluginContext, tokens } from '../../../plugins';
import { usePanelVizFeatures } from '../panel-viz-features';
import { PluginVizViewComponent } from '../../plugin-adaptor';
import './viz.css';
import { VizInstance } from '~/types/plugin';
import { EChartsOption } from 'echarts';

function usePluginViz(data: TPanelData, measure: WidthAndHeight): ReactNode | null {
  const { vizManager } = useContext(PluginContext);
  const {
    panel: { viz, title, id, name, description, queryIDs, variables },
  } = useRenderPanelContext();
  const panel: IViewPanelInfo = {
    id,
    name,
    title,
    description,
    queryIDs,
    viz,
  };
  const { withInteraction } = usePanelVizFeatures();
  const configureService = useConfigVizInstanceService(panel, withInteraction);
  try {
    // ensure that the plugin is loaded
    vizManager.resolveComponent(viz.type);
    return (
      <ServiceLocatorProvider configure={configureService}>
        <PluginVizViewComponent
          setVizConf={viz.setConf}
          panel={panel}
          measure={measure}
          data={data}
          variables={variables}
          vizManager={vizManager}
        />
        <PanelVizAddons />
      </ServiceLocatorProvider>
    );
  } catch (e) {
    console.info(get(e, 'message'));
    return null;
  }
}

interface IViz {
  data: TPanelData;
}

export const Viz = observer(function _Viz({ data }: IViz) {
  const { ref, width, height } = useElementSize();

  const pluginViz = usePluginViz(data, { w: width, h: height });

  const canRender = width > 0 && height > 0;
  return (
    <div className="viz-root" ref={ref}>
      <Box sx={{ width, height, overflow: 'hidden' }}>{canRender && <ErrorBoundary>{pluginViz}</ErrorBoundary>}</Box>
    </div>
  );
});

function useUpdateEchartsOptions(viz: VizInstance) {
  const { setEchartsOptions } = useRenderPanelContext(); // useEditPanelContext has no differnece on setEchartsOptions
  useEffect(() => {
    const listener = (opt: unknown) => {
      setEchartsOptions(opt as EChartsOption);
    };
    const channel = viz.messageChannels.getChannel('viz');
    channel.on('rendered', listener);
    return () => {
      channel.off('rendered', listener);
    };
  }, [viz.messageChannels]);
}

export const PanelVizAddons = () => {
  const sl = useServiceLocator();
  const instance = sl.getRequired(tokens.instanceScope.vizInstance);
  useUpdateEchartsOptions(instance);

  const { inEditMode } = useContext(LayoutStateContext);
  const addonManager = sl.getRequired(tokens.panelAddonManager);
  const { withAddon } = usePanelVizFeatures();
  const panelRoot = usePanelAddonSlot();
  if (!panelRoot || !withAddon) {
    return null;
  }
  return createPortal(
    <>
      {addonManager.createPanelAddonNode({
        viz: instance,
        isInEditMode: inEditMode,
      })}
    </>,
    panelRoot,
    'addon',
  );
};
