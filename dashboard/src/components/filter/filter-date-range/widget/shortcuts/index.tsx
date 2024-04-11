import { Button, Divider, Table, Text } from '@mantine/core';
import { DateRangeValue } from '../type';
import { GetRange, getDateRangeShortcuts } from './shortcuts';
import { useMemo } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

export const Shortcuts = ({ onChange }: { onChange: (v: DateRangeValue) => void }) => {
  const { t, i18n } = useTranslation();
  const getClickHandler = (getRange: GetRange) => () => {
    const range = getRange();
    onChange(range);
  };
  const shortcutGroups = useMemo(() => _.groupBy(getDateRangeShortcuts(), 'group'), []);
  const useFullLabel = i18n.language === 'zh';
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
                  {t(`filter.widget.date_range.shortcut.${group}.label`)}
                </Text>
              </th>
              {shortcuts.map(({ key, value, getRange }) => (
                <td key={key}>
                  <Button compact size="xs" variant="subtle" onClick={getClickHandler(getRange)}>
                    {t(`filter.widget.date_range.shortcut.${group}.${useFullLabel ? 'full.' : ''}${key}`)}
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
