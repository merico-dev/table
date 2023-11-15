import { Button, Divider, Table, Text } from '@mantine/core';
import { DateRangeValue } from '../type';
import { GetRange, shortcutGroups } from './shortcuts';

export const Shortcuts = ({ onChange }: { onChange: (v: DateRangeValue) => void }) => {
  const getClickHandler = (getRange: GetRange) => () => {
    const range = getRange();
    onChange(range);
  };
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
              {shortcuts.map(({ label, value, getRange }) => (
                <td key={label}>
                  <Button compact size="xs" variant="subtle" onClick={getClickHandler(getRange)}>
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
