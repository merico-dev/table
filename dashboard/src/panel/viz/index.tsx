import { LoadingOverlay, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { get } from 'lodash';

import { observer } from 'mobx-react-lite';
import React, { ReactNode, useContext } from 'react';
import { useConfigVizInstanceService } from '~/panel/use-config-viz-instance-service';
import { ServiceLocatorProvider } from '~/service-locator/use-service-locator';
import { usePanelContext } from '../../contexts';
import { IViewPanelInfo, PluginContext } from '../../plugins';
import { IVizConfig } from '../../types';
import { ErrorBoundary } from '../error-boundary';
import { PluginVizViewComponent } from '../plugin-adaptor';
import './index.css';

function usePluginViz(data: $TSFixMe, layout: IViewPanelInfo['layout']): ReactNode | null {
  const { vizManager } = useContext(PluginContext);
  const {
    panel: { viz, title, id, description, queryID, variables },
  } = usePanelContext();
  const panel: IViewPanelInfo = {
    title,
    id,
    description,
    queryID,
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
  data: $TSFixMe;
  loading: boolean;
  height: string;
  error?: string;
}

export const Viz = observer(function _Viz({ height: vizRootHeight, viz, data, loading, error }: IViz) {
  const { ref, width, height } = useElementSize();
  const empty = React.useMemo(() => !Array.isArray(data) || data.length === 0, [data]);

  const pluginViz = usePluginViz(data, { w: width, h: height });
  const dontNeedData = typesDontNeedData.includes(viz.type);
  if (dontNeedData) {
    return (
      <div className="viz-root" style={{ height: vizRootHeight }} ref={ref}>
        <ErrorBoundary>{pluginViz}</ErrorBoundary>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="viz-root" style={{ height: vizRootHeight }} ref={ref}>
        <LoadingOverlay visible={loading} exitTransitionDuration={0} />
      </div>
    );
  }
  return (
    <div className="viz-root" style={{ height: vizRootHeight }} ref={ref}>
      {error && (
        <Text color="red" size="md" align="center" sx={{ fontFamily: 'monospace' }}>
          {error}
        </Text>
      )}
      {!error && empty && (
        <Text color="gray" align="center">
          Empty Data
        </Text>
      )}
      {!empty && <ErrorBoundary>{pluginViz}</ErrorBoundary>}
    </div>
  );
});
