import { LoadingOverlay, Text } from '@mantine/core';
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

const typesDontNeedData = ['richText', 'button'];

interface IViz {
  viz: IVizConfig;
  data: TPanelData;
  loading: boolean;
  errors: string[];
  queryStateMessages: string[];
}

export const Viz = observer(function _Viz({ viz, data, loading, errors, queryStateMessages }: IViz) {
  const { ref, width, height } = useElementSize();

  const pluginViz = usePluginViz(data, { w: width, h: height });
  const dontNeedData = typesDontNeedData.includes(viz.type);
  if (dontNeedData) {
    return (
      <div className="viz-root" ref={ref}>
        <ErrorBoundary>{pluginViz}</ErrorBoundary>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="viz-root" style={{ position: 'relative' }} ref={ref}>
        <LoadingOverlay visible={loading} exitTransitionDuration={0} />
      </div>
    );
  }
  const showViz = errors.length === 0 && queryStateMessages.length === 0;
  return (
    <div className="viz-root" ref={ref}>
      {errors.map((err, i) => (
        <Text key={`${i}-${err}`} color="red" size="md" align="center" sx={{ fontFamily: 'monospace' }}>
          {err}
        </Text>
      ))}

      {queryStateMessages.map((msg, i) => (
        <Text key={`${i}-${msg}`} color="gray" align="center">
          {msg}
        </Text>
      ))}

      {showViz && <ErrorBoundary>{pluginViz}</ErrorBoundary>}
    </div>
  );
});
