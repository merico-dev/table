import { ActionIcon, Group, Select, Stack, Switch, Table, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { RunByCheckbox } from './run-by-checkbox';
import { MetricTableStyles } from './table-styles';
import { VariableSelector } from './variable-selector';
import { VariableStat } from './variable-stats';
import { DimensionSelector } from './dimension-selector/dimension-selector';
import { MericoMetricQueryMetaInstance } from '~/model';

type Props = {
  queryModel: QueryModelInstance;
};
export const LinkMetricsToTimeAndStep = observer(({ queryModel }: Props) => {
  const [timeField, setTimeField] = useState<string | null>('commit_author_time');
  const [timeVar, setTimeVar] = useState<string | null>('filter.date_range');
  const [stepVar, setStepVar] = useState<string | null>('filter.granularity');
  return (
    <Stack gap={7}>
      <Group justify="flex-start" gap={8}>
        <Text size="sm">按时间序列展示</Text>
        <Tooltip label="将看板的时间&步长筛选器与相应的查询维度关联上。">
          <ActionIcon size="xs" variant="subtle" color="gray">
            <IconInfoCircle />
          </ActionIcon>
        </Tooltip>
        <Switch size="xs" defaultChecked color="red" />
      </Group>

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
              <DimensionSelector
                queryModel={queryModel}
                label="时间维度"
                value={timeField}
                onChange={setTimeField}
                type="trending_date_col"
              />
            </Table.Td>
            <Table.Td colSpan={2} pr={0}>
              <Group justify="flex-start" gap={0} grow>
                <VariableStat variable={timeVar} />
                <VariableSelector queryModel={queryModel} value={timeVar} onChange={setTimeVar} />
              </Group>
            </Table.Td>
            <Table.Td>
              <RunByCheckbox queryModel={queryModel} variable={timeVar} />
            </Table.Td>
          </Table.Tr>
          <Table.Tr key="dimension.step">
            <Table.Td>步长</Table.Td>
            <Table.Td colSpan={2} pr={0}>
              <Group justify="flex-start" gap={0} grow>
                <VariableStat variable={stepVar} />
                <VariableSelector queryModel={queryModel} value={stepVar} onChange={setStepVar} />
              </Group>
            </Table.Td>
            <Table.Td>
              <RunByCheckbox queryModel={queryModel} variable={stepVar} />
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
});
