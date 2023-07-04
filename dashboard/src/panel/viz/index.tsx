import { useElementSize } from '@mantine/hooks';
import { get } from 'lodash';

import { observer } from 'mobx-react-lite';
import { ReactNode, useContext } from 'react';
import { useConfigVizInstanceService } from '~/panel/use-config-viz-instance-service';
import { ServiceLocatorProvider } from '~/service-locator/use-service-locator';
import { ErrorBoundary } from '~/utils/error-boundary';
import { usePanelContext } from '../../contexts';
import { IViewPanelInfo, PluginContext } from '../../plugins';
import { IVizConfig } from '../../types';
import { PluginVizViewComponent } from '../plugin-adaptor';
import './index.css';

function usePluginViz(data: TPanelData, layout: IViewPanelInfo['layout']): ReactNode | null {
  const { vizManager } = useContext(PluginContext);
  const {
    panel: { viz, title, id, description, queryIDs, variables },
  } = usePanelContext();
  const panel: IViewPanelInfo = {
    title,
    id,
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

  const canRender = width && height;
  return (
    <div className="viz-root" ref={ref}>
      {canRender && <ErrorBoundary>{pluginViz}</ErrorBoundary>}
    </div>
  );
});
