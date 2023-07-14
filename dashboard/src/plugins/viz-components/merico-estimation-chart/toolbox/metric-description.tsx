import { Button, HoverCard, Sx, Table } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

const TableSx: Sx = {
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
        <Button size="xs" variant="subtle" compact leftIcon={<IconInfoCircle size={14} />}>
          指标说明
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Table fontSize={14} sx={TableSx}>
          <tbody>
            <tr>
              <th>估算偏差</th>
              <td>
                使用斐波那契数列（1，2，3，5，8，13）估算故事点，每个数位为一个档位，计算issue实际故事点与估算故事点的档位偏差，即为估算偏差。如估算故事点为5，实际故事点为8，则估算偏差为-1。
              </td>
            </tr>
            <tr>
              <th>准确估算比例</th>
              <td>偏差在 ± 1 档位内的 issue 均为准确估算，以此计算准确估算的比例。</td>
            </tr>
          </tbody>
        </Table>
      </HoverCard.Dropdown>
    </HoverCard>
  );
}
