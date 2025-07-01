import { Group, Text } from '@mantine/core';
import { useMemo } from 'react';
import { paddings } from '~/styles/viz-box';
import { VizViewProps } from '~/types/plugin';
import { parseDataKey } from '~/utils/data';
import { IRegressionChartConf } from '../../type';
import { useDataKey } from '../use-data-key';
import { DataKeySelector } from './data-key-selector';
import { RegressionDescription } from './regression-description';

type Props = {
  conf: IRegressionChartConf;
  context: VizViewProps['context'];
  xDataKey: ReturnType<typeof useDataKey>;
  yDataKey: ReturnType<typeof useDataKey>;
  groupKey: ReturnType<typeof useDataKey>;
};

export function Toolbox({ conf, context, xDataKey, yDataKey, groupKey }: Props) {
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
    return rawData[x.queryID].map((row) => {
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
      <RegressionDescription conf={conf} queryData={queryData} groupKey={groupKey.value} />
      <DataKeySelector
        variant="unstyled"
        size="xs"
        onChange={xDataKey.set}
        value={xDataKey.value}
        leftSection={<Text size="xs">X轴</Text>}
        rightSectionWidth={14}
        w="auto"
        miw="unset"
      />
      <DataKeySelector
        variant="unstyled"
        size="xs"
        onChange={yDataKey.set}
        value={yDataKey.value}
        leftSection={<Text size="xs">Y轴</Text>}
        rightSectionWidth={14}
        w="auto"
        miw="unset"
      />
      <DataKeySelector
        variant="unstyled"
        size="xs"
        onChange={groupKey.set}
        value={groupKey.value}
        leftSection={<Text size="xs">拆分</Text>}
        rightSectionWidth={14}
        w="auto"
        miw="unset"
        clearable
      />
    </Group>
  );
}
