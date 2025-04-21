import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import _, { defaults, values } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useStorageData } from '~/components/plugins/hooks';
import { notifyVizRendered } from '~/components/plugins/viz-components/viz-instance-api';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { DefaultVizBox, getBoxContentHeight, getBoxContentWidth } from '~/styles/viz-box';
import { AnyObject } from '~/types';
import { IVizInteractionManager, VizInstance, VizViewProps } from '~/types/plugin';
import { ITemplateVariable, parseDataKey } from '~/utils';
import { HeatmapPagination } from './heatmap-pagination';
import { getOption } from './option';
import { useHeatmapGroupedData } from './render/use-heatmap-grouped-data';
import { SeriesDataItem, useHeatmapSeriesData } from './render/use-heatmap-series-data';
import { ClickHeatBlock } from './triggers';
import { DEFAULT_CONFIG, IHeatmapConf } from './type';

interface IClickHeatBlock {
  type: 'click';
  seriesType: 'heatblock';
  componentSubType: 'heatblock';
  componentType: 'series';
  name: string;
  color: string;
  value: [string, string, string];
  rowData: AnyObject;
}

function Chart({
  conf,
  data,
  seriesData,
  width,
  height,
  interactionManager,
  variables,
}: {
  conf: IHeatmapConf;
  data: TPanelData;
  seriesData: SeriesDataItem[];
  width: number;
  height: number;
  interactionManager: IVizInteractionManager;
  variables: ITemplateVariable[];
  instance: VizInstance;
}) {
  const rowDataMap = useMemo(() => {
    const x = parseDataKey(conf.x_axis.data_key);
    const y = parseDataKey(conf.y_axis.data_key);
    return _.keyBy(data[x.queryID], (d) => `${d[x.columnKey]}---${d[y.columnKey]}`);
  }, [data, conf.x_axis.data_key, conf.y_axis.data_key]);

  const triggers = useTriggerSnapshotList<IHeatmapConf>(interactionManager.triggerManager, ClickHeatBlock.id);

  const handleHeatBlockClick = useCallback(
    (params: IClickHeatBlock) => {
      const [x, y] = params.value;
      const rowData = _.get(rowDataMap, `${x}---${y}`, { error: 'rowData is not found' });
      triggers.forEach((t) => {
        interactionManager.runInteraction(t.id, { ...params, rowData });
      });
    },
    [rowDataMap, triggers, interactionManager],
  );
  const echartsInstanceRef = React.useRef<ReactEChartsCore>(null);
  const onEvents = useMemo(() => {
    return {
      click: handleHeatBlockClick,
    };
  }, [handleHeatBlockClick]);

  const option = React.useMemo(() => {
    return getOption(conf, data, seriesData, variables, width, height);
  }, [conf, data, seriesData, width, height]);

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ width, height }}
      ref={echartsInstanceRef}
      onEvents={onEvents}
      notMerge
      theme="merico-light"
    />
  );
}

export function VizHeatmap({ context, instance }: VizViewProps) {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });

  const { value: confValue } = useStorageData<IHeatmapConf>(context.instanceData, 'config');
  const { variables } = context;
  const conf = useMemo(() => defaults({}, confValue, DEFAULT_CONFIG), [confValue]);
  const data = context.data;
  const { width, height } = context.viewport;
  const { totalPages, groupedFullData } = useHeatmapGroupedData(data, conf);
  useEffect(() => {
    const fullData = values(groupedFullData).flat();
    notifyVizRendered(instance, getOption(conf, data, fullData, variables, width, height));
  }, [groupedFullData]);
  const [page, setPage] = useState(1);
  const seriesData = useHeatmapSeriesData(groupedFullData, conf, page);

  if (!width || !height) {
    return null;
  }

  return (
    <DefaultVizBox width={width} height={height}>
      {conf.pagination.page_size > 0 && (
        <HeatmapPagination page={page} setPage={setPage} totalPages={totalPages} width={width} />
      )}
      <Chart
        instance={instance}
        variables={variables}
        width={getBoxContentWidth(width)}
        height={getBoxContentHeight(height)}
        data={data}
        seriesData={seriesData}
        conf={conf}
        interactionManager={interactionManager}
      />
    </DefaultVizBox>
  );
}
