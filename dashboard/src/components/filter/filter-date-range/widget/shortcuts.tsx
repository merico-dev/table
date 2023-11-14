import { Button, Divider, Table, Text } from '@mantine/core';
import { DateRangeValue, SetDateValue } from './type';

const shortcutGroups = {
  last: [
    { label: 'yesterday', value: 'yesterday', onClick: () => {} },
    { label: 'week', value: 'last week', onClick: () => {} },
    { label: 'month', value: 'last month', onClick: () => {} },
    { label: '2 months', value: 'last 2 months', onClick: () => {} },
    { label: '3 months', value: 'last 3 months', onClick: () => {} },
    { label: 'year', value: 'last year', onClick: () => {} },
  ],
  recent: [
    { label: '7 days', value: 'recent 7 days', onClick: () => {} },
    { label: '30 days', value: 'recent 30 days', onClick: () => {} },
    { label: '60 days', value: 'recent 60 days', onClick: () => {} },
    { label: '90 days', value: 'recent 90 days', onClick: () => {} },
    { label: '180 days', value: 'recent 180 days', onClick: () => {} },
    { label: '365 days', value: 'recent 365 days', onClick: () => {} },
  ],
  this: [
    { label: 'today', value: 'today', onClick: () => {} },
    { label: 'week', value: 'this week', onClick: () => {} },
    { label: 'month', value: 'this month', onClick: () => {} },
    { label: '2 months', value: 'this 2 months', onClick: () => {} },
    { label: '3 months', value: 'this 3 months', onClick: () => {} },
    { label: 'year', value: 'this year', onClick: () => {} },
  ],
};

export const Shortcuts = ({ onChange }: { onChange: (v: DateRangeValue) => void }) => {
  return (
    <>
      <Divider variant="dashed" my={10} />
      <Table
        withBorder={false}
        sx={{
          'tbody > tr > th, tbody > tr > td': { borderTop: 'none', padding: '2px 6px' },
          'tbody > tr > th': { cursor: 'default', userSelect: 'none' },
          td: { paddingLeft: '1px' },
        }}
      >
        <tbody>
          {Object.entries(shortcutGroups).map(([group, shortcuts]) => (
            <tr key={group}>
              <th>
                <Text size="xs" color="#555">
                  {group}
                </Text>
              </th>
              {shortcuts.map(({ label, value, onClick }) => (
                <td key={label}>
                  <Button compact size="xs" variant="subtle">
                    {label}
                  </Button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};
