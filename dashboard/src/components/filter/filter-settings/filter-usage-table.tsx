import { Button, Table, Text } from '@mantine/core';
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
    return <Text size="xs">{t('filter.usage.unused_description')}</Text>;
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
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ width: 80 }}>类型</Table.Th>
          <Table.Th>名称</Table.Th>
          <Table.Th style={{ width: 80 }}>操作</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {usages.map((u) => {
          return (
            <Table.Tr key={u.id}>
              <Table.Td>{t(u.type_label)}</Table.Td>
              <Table.Td>
                <Text size="xs" truncate="end">
                  {u.label}
                </Text>
              </Table.Td>
              <Table.Td>
                <Button size="xs" variant="subtle" onClick={() => openEditor(u)}>
                  打开
                </Button>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
});
