import { LoadingOverlay, Text } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import { get } from 'lodash';
import React, { ReactNode, useContext } from 'react';
import { usePanelContext } from '../../contexts';
import { IViewPanelInfo, PluginContext } from '../../plugins';
import { PluginVizViewComponent } from '../plugin-adaptor';

import { observer } from 'mobx-react-lite';
import { IVizConfig } from '../../types';
import { ErrorBoundary } from '../error-boundary';
import './index.css';

function usePluginViz(data: $TSFixMe, layout: IViewPanelInfo['layout']): ReactNode | null {
  const { vizManager } = useContext(PluginContext);
  const {
    panel: { viz, title, id, description, queryID, style },
  } = usePanelContext();
  const panel: IViewPanelInfo = {
    title,
    id,
    description,
    queryID,
    viz,
    layout,
    style: style.json,
  };
  try {
    // ensure that the plugin is loaded
    vizManager.resolveComponent(viz.type);
    return <PluginVizViewComponent panel={panel} data={data} vizManager={vizManager} />;
  } catch (e) {
    console.info(get(e, 'message'));
    return null;
  }
}

const typesDontNeedData = ['richText'];

interface IViz {
  viz: IVizConfig;
  data: $TSFixMe;
  loading: boolean;
  height: string;
}

export const Viz = observer(function _Viz({ height: vizRootHeight, viz, data, loading }: IViz) {
  const { ref, width, height } = useElementSize();
  const empty = React.useMemo(() => !Array.isArray(data) || data.length === 0, [data]);

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
      <div className="viz-root" style={{ height: vizRootHeight }} ref={ref}>
        <LoadingOverlay visible={loading} exitTransitionDuration={0} />
      </div>
    );
  }
  return (
    <div className="viz-root" style={{ height: vizRootHeight }} ref={ref}>
      {empty && (
        <Text color="gray" align="center">
          nothing to show
        </Text>
      )}
      {!empty && <ErrorBoundary>{pluginViz}</ErrorBoundary>}
    </div>
  );
});
