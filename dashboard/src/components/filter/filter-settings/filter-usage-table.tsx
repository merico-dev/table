import { Anchor, Button, Table, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';
import { FilterModelInstance, FilterUsageType } from '~/dashboard-editor';
type Props = {
  filter: FilterModelInstance;
};
export const FilterUsageTable = observer(({ filter }: Props) => {
  const { t } = useTranslation();
  const editor = useEditDashboardContext().editor;
  const usages = filter.usages;
  const openEditor = (usage: FilterUsageType) => {
    switch (usage.type) {
      case 'query':
        editor.setPath(['_QUERIES_', usage.id]);
        break;
      case 'sql_snippet':
        editor.setPath(['_SQL_SNIPPETS_', usage.id]);
        break;
      case 'view':
        editor.setPath(['_VIEWS_', usage.id]);
      default:
        return;
    }
  };
  if (usages.length === 0) {
    return (
      <Text mt={10} ml={10} size="sm">
        {t('filter.usage.unused_description')}
      </Text>
    );
  }
  return (
    <Table
      highlightOnHover
      layout="fixed"
      styles={{
        table: {
          fontSize: '14px',
        },
      }}
    >
      <colgroup>
        <col style={{ width: 80 }}></col>
        <col></col>
      </colgroup>
      <Table.Tbody>
        {usages.map((u) => {
          return (
            <Table.Tr key={u.id}>
              <Table.Td>
                <Text size="xs">{t(u.type_label)}</Text>
              </Table.Td>
              <Table.Td>
                <Anchor size="xs" title={u.label} onClick={() => openEditor(u)}>
                  <Text truncate="end">{u.label}</Text>
                </Anchor>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
});
