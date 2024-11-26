import { ActionIcon, Checkbox, Group, Select, Stack, Table, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MetricTableStyles } from './table-styles';
import { VariableSelector } from './variable-selector';
import { VariableStat } from './variable-stats';
import { DimensionSelector } from './dimension-selector/dimension-selector';
import { MericoMetricQueryMetaInstance } from '~/model';

type Props = {
  queryModel: QueryModelInstance;
};
export const LinkMetricsToVariables = observer(({ queryModel }: Props) => {
  const model = useEditDashboardContext();
  const config = queryModel.config as MericoMetricQueryMetaInstance;
  return (
    <Stack gap={7}>
      <Group justify="flex-start" gap={8}>
        <Text size="sm">看板变量与指标维度关联</Text>
        <Tooltip label="将看板的筛选器参数与指标的查询维度关联上，使指标可以按照看板的筛选条件和背景变量进行关联展示。">
          <ActionIcon size="xs" variant="subtle" color="gray">
            <IconInfoCircle />
          </ActionIcon>
        </Tooltip>
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
            <Table.Td>指标筛选维度</Table.Td>
            <Table.Td>看板变量</Table.Td>
            <Table.Td colSpan={2}>变量值为真时运行查询</Table.Td>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Object.entries(config.filters).map(([k, v]) => (
            <Table.Tr key={k}>
              <Table.Td>
                <DimensionSelector
                  queryModel={queryModel}
                  value={k}
                  onChange={(dimension: string | null) => dimension && config.changeFilterVariable(dimension, v)}
                  type="filter"
                />
              </Table.Td>
              <Table.Td colSpan={2} pr={0}>
                <Group justify="flex-start" grow gap={0} w="100%">
                  <VariableStat variable={v} />
                  <VariableSelector
                    queryModel={queryModel}
                    value={v}
                    onChange={(value: string | null) => value && config.changeFilterVariable(k, value)}
                  />
                </Group>
              </Table.Td>
              <Table.Td>
                <Checkbox
                  size="xs"
                  checked={queryModel.keyInRunBy(v)}
                  onChange={(event) => queryModel.changeRunByRecord(v, event.currentTarget.checked)}
                  color="red"
                />
              </Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr className="add-a-row">
            <Table.Td pr={0}>
              <DimensionSelector
                queryModel={queryModel}
                value={null}
                onChange={(dimension: string | null) => dimension && config.addFilter(dimension)}
                type="filter"
              />
            </Table.Td>
            <Table.Td colSpan={2} pr={0}>
              <VariableSelector queryModel={queryModel} value={null} onChange={console.log} />
            </Table.Td>
            <Table.Td />
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
});
