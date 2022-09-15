import { get } from 'lodash';
import React, { ReactNode, useContext } from 'react';
import { useElementSize } from '@mantine/hooks';
import { LoadingOverlay, Text } from '@mantine/core';
import { PanelContext } from '../../contexts';
import { PluginContext, IViewPanelInfo } from '../../plugins';
import { PluginVizViewComponent } from '../plugin-adaptor';

import './index.css';
import { IVizConfig } from '../../types';
import { ErrorBoundary } from '../error-boundary';
import { observer } from 'mobx-react-lite';

function usePluginViz(data: $TSFixMe, layout: IViewPanelInfo['layout']): ReactNode | null {
  const { vizManager } = useContext(PluginContext);
  const { viz, title, id, description, queryID } = useContext(PanelContext);
  const panel: IViewPanelInfo = {
    title,
    id,
    description,
    queryID,
    viz,
    layout,
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

function renderViz(width: number, height: number, data: $TSFixMe[], viz: IVizConfig) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const props = { width, height, data, conf: viz.conf };
  switch (viz.type) {
    default:
      return null;
  }
}

const typesDontNeedData = ['rich-text'];

interface IViz {
  viz: IVizConfig;
  data: $TSFixMe;
  loading: boolean;
}

export const Viz = observer(function _Viz({ viz, data, loading }: IViz) {
  const { ref, width, height } = useElementSize();
  const empty = React.useMemo(() => !Array.isArray(data) || data.length === 0, [data]);

  const pluginViz = usePluginViz(data, { w: width, h: height });
  const needData = !typesDontNeedData.includes(viz.type) || !!pluginViz;
  if (!needData) {
    return (
      <div className="viz-root" ref={ref}>
        <ErrorBoundary>{renderViz(width, height, data, viz)}</ErrorBoundary>
      </div>
    );
  }

  const finalViz = pluginViz || renderViz(width, height, data, viz);
  if (loading) {
    return (
      <div className="viz-root" ref={ref}>
        <LoadingOverlay visible={loading} exitTransitionDuration={0} />
      </div>
    );
  }
  return (
    <div className="viz-root" ref={ref}>
      {empty && (
        <Text color="gray" align="center">
          nothing to show
        </Text>
      )}
      {!empty && <ErrorBoundary>{finalViz}</ErrorBoundary>}
    </div>
  );
});
