import { Button, Table, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { FilterModelInstance } from '~/dashboard-editor';
type Props = {
  filter: FilterModelInstance;
};
export const FilterUsageTable = observer(({ filter }: Props) => {
  const { t } = useTranslation();
  const usages = filter.usages;
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
          <Table.Th style={{ width: 100 }}>类型</Table.Th>
          <Table.Th>名称</Table.Th>
          <Table.Th style={{ width: 100 }}>操作</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {usages.map((u) => {
          return (
            <Table.Tr key={u.id}>
              <Table.Td>{t(u.type_label)}</Table.Td>
              <Table.Td>{u.label}</Table.Td>
              <Table.Td>
                {u.type !== 'view' && (
                  <Button size="xs" variant="subtle">
                    打开
                  </Button>
                )}
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
});
