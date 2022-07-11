import React from "react";
import _ from "lodash";
import { useElementSize } from "@mantine/hooks";
import { LoadingOverlay, Text } from '@mantine/core';

import { Sunbrust } from './sunburst';
import { VizCartesianChart } from './cartesian';
import { VizTable } from './table';
import { VizText } from "./text";
import { VizBar3D } from "./bar-3d";
import './index.css';
import { IVizConfig } from "../../types/dashboard";
import { VizPie } from "./pie";
import { VizStats } from "./stats";
import { ErrorBoundary } from "../error-boundary";
import { VizRichText } from "./rich-text";

function renderViz(width: number, height: number, data: any[], viz: IVizConfig) {
  const props = { width, height, data, conf: viz.conf }
  switch (viz.type) {
    case 'sunburst': return <Sunbrust {...props} />;
    // @ts-expect-error
    case 'cartesian': return <VizCartesianChart {...props} />;
    // @ts-expect-error
    case 'table': return <VizTable {...props} />;
    case 'text': return <VizText {...props} />;
    // @ts-expect-error
    case 'stats': return <VizStats {...props} />;
    // @ts-expect-error
    case 'rich-text': return <VizRichText {...props} />;
    case 'bar-3d': return <VizBar3D {...props} />;
    case 'pie': return <VizPie {...props} />;
    default: return null;
  }
}

interface IViz {
  viz: IVizConfig;
  data: any;
  loading: boolean;
}

export function Viz({ viz, data, loading }: IViz) {
  const { ref, width, height } = useElementSize();
  const empty = React.useMemo(() => !Array.isArray(data) || data.length === 0, [data])
  if (loading) {
    return (
      <div className="viz-root" ref={ref}>
        <LoadingOverlay visible={loading} exitTransitionDuration={0} />
      </div>
    )
  }
  return (
    <div className="viz-root" ref={ref}>
      {empty && <Text color="gray" align="center">nothing to show</Text>}
      {!empty && (
        <ErrorBoundary>
          {renderViz(width, height, data, viz)}
        </ErrorBoundary>
      )}
    </div>
  )
}
