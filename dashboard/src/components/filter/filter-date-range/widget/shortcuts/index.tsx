import { Button, Divider, Table, Text } from '@mantine/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DateRangeValue } from '~/model';
import { GetRange, getShortcutsInGroups } from './shortcuts';

export const Shortcuts = ({ onChange }: { onChange: (v: DateRangeValue) => void }) => {
  const { t, i18n } = useTranslation();
  const getClickHandler = (getRange: GetRange) => () => {
    const range = getRange();
    onChange(range);
  };
  const shortcutGroups = useMemo(() => getShortcutsInGroups(), []);
  const useFullLabel = i18n.language === 'zh';
  return (
    <>
      <Divider variant="dashed" my={10} />
      <Table
        withTableBorder={false}
        sx={{
          'tbody > tr': { border: 'none' },
          'tbody > tr > th, tbody > tr > td': { borderTop: 'none', padding: '2px 6px' },
          'tbody > tr > th': { cursor: 'default', userSelect: 'none' },
          td: { paddingLeft: '1px' },
        }}
      >
        <Table.Tbody>
          {Object.entries(shortcutGroups).map(([group, shortcuts]) => (
            <Table.Tr key={group}>
              <Table.Th>
                <Text size="xs" c="#555" fw={500} sx={{ textAlignLast: 'justify' }}>
                  {t(`filter.widget.date_range.shortcut.${group}.label`)}
                </Text>
              </Table.Th>
              {shortcuts.map(({ key, value, getRange }) => (
                <Table.Td key={key}>
                  <Button size="compact-xs" variant="subtle" onClick={getClickHandler(getRange)}>
                    {t(`filter.widget.date_range.shortcut.${group}.${useFullLabel ? 'full.' : ''}${key}`)}
                  </Button>
                </Table.Td>
              ))}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </>
  );
};
