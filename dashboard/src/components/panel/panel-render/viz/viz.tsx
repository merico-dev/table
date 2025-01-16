import { useElementSize } from '@mantine/hooks';
import { get } from 'lodash';
import { createPortal } from 'react-dom';

import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode, useContext } from 'react';
import { useConfigVizInstanceService } from '~/components/panel/use-config-viz-instance-service';
import {
  ServiceLocatorProvider,
  useServiceLocator,
} from '~/components/plugins/service/service-locator/use-service-locator';
import { WidthAndHeight } from '~/components/plugins/viz-manager/components';
import { ErrorBoundary } from '~/utils';
import { useRenderPanelContext } from '../../../../contexts';
import { IViewPanelInfo, PluginContext, tokens } from '../../../plugins';
import { PluginVizViewComponent } from '../../plugin-adaptor';
import './viz.css';

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
  const configureService = useConfigVizInstanceService(panel);
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
        <PanelVizAddons panelId={panel.id} />
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

export const PanelVizAddons = ({ panelId }: { panelId: string }) => {
  const sl = useServiceLocator();
  const instance = sl.getRequired(tokens.instanceScope.vizInstance);
  const addonManager = sl.getRequired(tokens.panelAddonManager);
  const panelRoot = document.getElementById(`panel-root-${panelId}`);
  if (!panelRoot) {
    return null;
  }
  return createPortal(<>{addonManager.createPanelAddonNode({ viz: instance })}</>, panelRoot, 'addon');
};
