import { ActionIcon, Checkbox, Group, Stack, Switch, Table, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { QueryModelInstance } from '~/dashboard-editor/model';
import { MetricTableStyles } from '../table-styles';

const rows = [
  { metric: '时间维度：commit_author_time', variable: 'filter.date_range', checked: true },
  { metric: '步长', variable: 'filter.granularity', checked: true },
];

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
        <Switch size="xs" defaultChecked />
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
          {rows.map((row) => (
            <Table.Tr key={row.metric}>
              <Table.Td>{row.metric}</Table.Td>
              <Table.Td colSpan={2}>{row.variable}</Table.Td>
              <Table.Td>
                <Checkbox size="xs" defaultChecked={row.checked} color="red" />
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Stack>
  );
});
