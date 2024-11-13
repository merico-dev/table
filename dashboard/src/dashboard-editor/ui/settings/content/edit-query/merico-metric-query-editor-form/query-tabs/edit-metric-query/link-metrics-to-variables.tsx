import { ActionIcon, Checkbox, Group, Select, Stack, Table, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MetricTableStyles } from './table-styles';
import { VariableSelector } from './variable-selector';
import { VariableStat } from './variable-stats';

const rows = [
  { metric: 'repository_project -> id', variable: 'context.project_ids', checked: true },
  { metric: 'account -> id', variable: 'context.account_id', checked: false },
  { metric: 'organization -> id', variable: 'filters.tree_select', checked: false },
  { metric: 'team -> id', variable: 'filters.multi_select', checked: true },
];

type Props = {
  queryModel: QueryModelInstance;
};
export const LinkMetricsToVariables = observer(({ queryModel }: Props) => {
  const model = useEditDashboardContext();
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
          {rows.map((row) => (
            <Table.Tr key={row.metric}>
              <Table.Td>{row.metric}</Table.Td>
              <Table.Td colSpan={2} pr={0}>
                <Group justify="flex-start" grow gap={0} w="100%">
                  <VariableStat variable={row.variable} />
                  <VariableSelector queryModel={queryModel} value={row.variable} onChange={console.log} />
                </Group>
              </Table.Td>
              <Table.Td>
                <Checkbox size="xs" defaultChecked={row.checked} color="red" />
              </Table.Td>
            </Table.Tr>
          ))}
          <Table.Tr className="add-a-row">
            <Table.Td p={0}>
              <Select
                size="xs"
                data={['React', 'Angular', 'Vue', 'Svelte']}
                searchable
                placeholder="选择维度"
                styles={{ input: { border: 'none' } }}
              />
            </Table.Td>
            <Table.Td colSpan={2} p={0}>
              <VariableSelector queryModel={queryModel} value={null} onChange={console.log} />
            </Table.Td>
            <Table.Td />
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack>
  );
});
