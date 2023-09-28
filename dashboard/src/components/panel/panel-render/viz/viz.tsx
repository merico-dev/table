import { useElementSize } from '@mantine/hooks';
import { get } from 'lodash';

import { observer } from 'mobx-react-lite';
import { ReactNode, useContext } from 'react';
import { useConfigVizInstanceService } from '~/components/panel/use-config-viz-instance-service';
import { ServiceLocatorProvider } from '~/components/plugins/service/service-locator/use-service-locator';
import { ErrorBoundary } from '~/utils/error-boundary';
import { useRenderPanelContext } from '../../../../contexts';
import { IViewPanelInfo, PluginContext } from '../../../plugins';
import { PluginVizViewComponent } from '../../plugin-adaptor';
import './viz.css';
import { Box } from '@mantine/core';

function usePluginViz(data: TPanelData, layout: IViewPanelInfo['layout']): ReactNode | null {
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
    layout,
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
          data={data}
          variables={variables}
          vizManager={vizManager}
        />
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
