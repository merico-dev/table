import { Group } from '@mantine/core';
import { useMemo } from 'react';
import { paddings } from '~/styles/viz-box';
import { VizViewProps } from '~/types/plugin';
import { parseDataKey, ParsedDataKey } from '~/utils/data';
import { IRegressionChartConf } from '../../type';
import { useDataKey } from '../use-data-key';
import { ChooseDataKeys } from './choose-data-keys';
import { RegressionDescription } from './regression-description';

type Props = {
  conf: IRegressionChartConf;
  context: VizViewProps['context'];
  xDataKey: ReturnType<typeof useDataKey>;
  yDataKey: ReturnType<typeof useDataKey>;
  groupKey: ReturnType<typeof useDataKey>;
  x: ParsedDataKey;
  y: ParsedDataKey;
  g: ParsedDataKey;
};

export function Toolbox({ conf, context, xDataKey, yDataKey, groupKey, x, y, g }: Props) {
  // for description only
  const queryData = useMemo(() => {
    const rawData = context.data;
    const xDataKey = conf?.x_axis.data_key;
    const yDataKey = conf?.regression?.y_axis_data_key;

    if (!xDataKey || !yDataKey) {
      return [];
    }
    const x = parseDataKey(xDataKey);
    const y = parseDataKey(yDataKey);
    return rawData[x.queryID]?.map((row) => {
      if (typeof row[y.columnKey] === 'number') {
        return row;
      }
      return {
        ...row,
        [y.columnKey]: Number(row[y.columnKey]),
      };
    });
  }, [xDataKey.value, yDataKey.value, context.data]);

  return (
    <Group
      justify="flex-start"
      sx={{ position: 'absolute', top: 0, left: paddings.left, right: paddings.right, height: '22px', zIndex: 1 }}
    >
      <RegressionDescription conf={conf} queryData={queryData} x={x} y={y} g={g} />
      <ChooseDataKeys xDataKey={xDataKey} yDataKey={yDataKey} groupKey={groupKey} />
    </Group>
  );
}
