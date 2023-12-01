import { Text } from '@mantine/core';
import { useMemo } from 'react';
import { VizInstance, VizViewContext, VizViewProps } from '~/types/plugin';
import { parseDataKey } from '~/utils';
import { useStorageData } from '../../..';
import { ITableConf } from '../type';
import { VizTableComponent } from './viz-table-component';
import { useWhyDidYouUpdate } from 'ahooks';

type IPrepareDataAndRender = {
  data: TPanelData;
  width: number;
  height: number;
  conf: ITableConf;
  instance: VizInstance;
  context: VizViewContext;
};
function PrepareDataAndRender({ data, width, height, conf, context, instance }: IPrepareDataAndRender) {
  const { id_field, use_raw_columns, columns } = conf;

  const queryData = useMemo(() => {
    if (!id_field) {
      return [];
    }
    const k = parseDataKey(id_field);
    return data[k.queryID];
  }, [data, id_field]);

  if (!Array.isArray(queryData) || queryData.length === 0) {
    return (
      <Text color="gray" align="center">
        Empty Data
      </Text>
    );
  }

  return (
    <VizTableComponent
      queryData={queryData}
      width={width}
      height={height}
      conf={conf}
      context={context}
      instance={instance}
    />
  );
}

export function VizTable({ context, instance }: VizViewProps) {
  const data = context.data;
  const { height, width } = context.viewport;
  const { value: conf } = useStorageData<ITableConf>(context.instanceData, 'config');

  if (!conf) {
    return null;
  }

  if (!conf.id_field) {
    return (
      <Text color="red" align="center">
        ID Field is not set, can't render a table without it
      </Text>
    );
  }

  return (
    <PrepareDataAndRender data={data} width={width} height={height} conf={conf} context={context} instance={instance} />
  );
}
