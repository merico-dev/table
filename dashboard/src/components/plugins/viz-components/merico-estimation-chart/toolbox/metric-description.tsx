import { Button, HoverCard, Table } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { IconInfoCircle } from '@tabler/icons-react';

const TableSx: EmotionSx = {
  'tbody th, tbody td': {
    padding: '7px 10px',
  },
  'tbody tr:not(:first-of-type) th': {
    borderTop: '1px solid #dee2e6',
  },
};

export function MetricsDescription() {
  return (
    <HoverCard width={400} shadow="md">
      <HoverCard.Target>
        <Button variant="subtle" size="compact-xs" leftSection={<IconInfoCircle size={14} />}>
          指标说明
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Table fz={14} sx={TableSx}>
          <Table.Tbody>
            <Table.Tr>
              <Table.Th>估算偏差</Table.Th>
              <Table.Td>
                使用斐波那契数列（1，2，3，5，8，13）估算故事点，每个数位为一个档位，计算issue实际故事点与估算故事点的档位偏差，即为估算偏差。如估算故事点为5，实际故事点为8，则估算偏差为-1。
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>准确估算比例</Table.Th>
              <Table.Td>偏差在 ± 1 档位内的 issue 均为准确估算，以此计算准确估算的比例。</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
