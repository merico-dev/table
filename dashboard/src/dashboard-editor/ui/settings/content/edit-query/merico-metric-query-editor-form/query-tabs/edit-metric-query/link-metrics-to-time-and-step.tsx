import { ActionIcon, Group, Stack, Table, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { MericoMetricQueryMetaInstance } from '~/model';
import { RunByCheckbox } from './run-by-checkbox';
import { MetricTableStyles } from './table-styles';
import { TimeQuerySwitch } from './time-query-switch';
import { VariableSelector } from './variable-selector';
import { VariableStat } from './variable-stats';

const TrendingDateSettings = observer(({ queryModel }: Props) => {
  const config = queryModel.config as MericoMetricQueryMetaInstance;
  const ds = queryModel.datasource as DataSourceModelInstance;
  const mmInfo = ds.mericoMetricInfo;
  const metric = mmInfo.metricDetail;
  const trendingDateCol = metric.trendingDateCol;
  if (!config.timeQuery.enabled || !metric.supportTrending) {
    return null;
  }

  return (
    <Table withTableBorder withColumnBorders layout="fixed" styles={MetricTableStyles}>
      <colgroup>
        <col style={{ width: 250 }} />
        <col />
        <col style={{ width: 130 }} />
        <col style={{ width: 40 }} />
      </colgroup>
      <Table.Thead>
        <Table.Tr>
          <Table.Td></Table.Td>
          <Table.Td>看板变量</Table.Td>
          <Table.Td colSpan={2}>变量值为真时运行查询</Table.Td>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr key="dimension.time">
          <Table.Td pr={0}>
            <Group gap={4}>
              <Text size="xs">时间维度</Text>
              <Text size="xs" c="dimmed" ff="monospace">
                {trendingDateCol?.name ?? null}
              </Text>
            </Group>
          </Table.Td>
          <Table.Td colSpan={2} pr={0}>
            <Group justify="flex-start" gap={0} grow>
              <VariableStat variable={config.timeQuery.range_variable} />
              <VariableSelector
                queryModel={queryModel}
                value={config.timeQuery.range_variable}
                onChange={config.setRangeVariable}
                usedKeys={config.usedTimeQueryVariableSet}
              />
            </Group>
          </Table.Td>
          <Table.Td>
            <RunByCheckbox queryModel={queryModel} variable={config.timeQuery.range_variable} />
          </Table.Td>
        </Table.Tr>
        <Table.Tr key="dimension.step">
          <Table.Td>
            <Text size="xs">步长</Text>
          </Table.Td>
          <Table.Td colSpan={2} pr={0}>
            <Group justify="flex-start" gap={0} grow>
              <VariableStat variable={config.timeQuery.unit_variable} />
              <VariableSelector
                queryModel={queryModel}
                value={config.timeQuery.unit_variable}
                onChange={config.setUnitVariable}
              />
            </Group>
          </Table.Td>
          <Table.Td>
            <RunByCheckbox queryModel={queryModel} variable={config.timeQuery.unit_variable} />
          </Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
});

type Props = {
  queryModel: QueryModelInstance;
};
export const LinkMetricsToTimeAndStep = observer(({ queryModel }: Props) => {
  return (
    <Stack gap={7}>
      <Group justify="flex-start" gap={8}>
        <Text size="sm">按时间序列展示</Text>
        <Tooltip label="将看板的时间&步长筛选器与相应的查询维度关联上。">
          <ActionIcon size="xs" variant="subtle" color="gray">
            <IconInfoCircle />
          </ActionIcon>
        </Tooltip>
        <TimeQuerySwitch queryModel={queryModel} />
      </Group>

      <TrendingDateSettings queryModel={queryModel} />
    </Stack>
  );
});
