import { ActionIcon, Checkbox, Group, Stack, Table, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { MericoMetricQueryMetaInstance } from '~/model';
import { DimensionSelector } from './dimension-selector/dimension-selector';
import { MetricTableStyles } from './table-styles';
import { VariableSelector } from './variable-selector';
import { VariableStat } from './variable-stats';

type Props = {
  queryModel: QueryModelInstance;
};
export const LinkMetricsToVariables = observer(({ queryModel }: Props) => {
  const config = queryModel.config as MericoMetricQueryMetaInstance;
  const ds = queryModel.datasource as DataSourceModelInstance;
  const mmInfo = ds.mericoMetricInfo;

  useEffect(() => {
    mmInfo.selectMetric(config.id);
  }, [config.id, mmInfo]);

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
          {config.filters.map((f) => (
            <Table.Tr key={f.dimension}>
              <Table.Td pr={0}>
                <DimensionSelector
                  queryModel={queryModel}
                  value={f.dimension}
                  onChange={f.setDimension}
                  usedKeys={config.usedFilterDimensionKeys}
                />
              </Table.Td>
              <Table.Td colSpan={2} pr={0}>
                <Group justify="flex-start" grow gap={0} w="100%">
                  <VariableStat variable={f.variable} />
                  <VariableSelector
                    queryModel={queryModel}
                    value={f.variable}
                    onChange={f.setVariable}
                    usedKeys={config.usedFilterVariableSet}
                  />
                </Group>
              </Table.Td>
              <Table.Td>
                <Checkbox
                  size="xs"
                  checked={queryModel.keyInRunBy(f.variable)}
                  onChange={(event) => queryModel.changeRunByRecord(f.variable, event.currentTarget.checked)}
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
                onChange={(v: string | null) => v && config.addFilter(v, '')}
                usedKeys={config.usedFilterDimensionKeys}
              />
            </Table.Td>
            <Table.Td colSpan={2} pr={0}>
              <VariableSelector
                queryModel={queryModel}
                value={null}
                onChange={(v: string | null) => v && config.addFilter('', v)}
                usedKeys={config.usedFilterVariableSet}
              />
            </Table.Td>
            <Table.Td />
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
});
