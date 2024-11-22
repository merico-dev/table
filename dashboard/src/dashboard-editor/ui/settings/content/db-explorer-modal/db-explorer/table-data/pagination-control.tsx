import { Group, Pagination, Select, Text } from '@mantine/core';
import { EmotionStyles } from '@mantine/emotion';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';

const limitOptions = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

const selectorStyles: EmotionStyles = {
  section: {
    width: '50px',
    textAlign: 'center',
  },
  input: {
    paddingLeft: '50px',
  },
};

export const PaginationControl = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const { t } = useTranslation();
  const { tableData } = dataSource.dbInfo;
  return (
    <Group pt={10} px={10} justify="space-between">
      <Group justify="flex-start">
        {tableData.maxPage > 1 && (
          <Pagination
            size="sm"
            value={tableData.page}
            onChange={tableData.setPage}
            total={tableData.maxPage}
            withEdges={tableData.maxPage > 7}
            styles={{ control: { height: '30px' } }}
          />
        )}
        <Select
          leftSection={
            <Text ta="center" c="dimmed" size={'14px'}>
              {t('common.pagination.page_size')}
            </Text>
          }
          size="xs"
          styles={selectorStyles}
          data={limitOptions}
          value={String(tableData.limit)}
          onChange={(v) => tableData.setLimit(Number(v))}
          comboboxProps={{
            zIndex: 340,
          }}
        />
      </Group>
      <Group justify="flex-end">
        <Text c="dimmed" my={0} size={'14px'}>
          {t('common.pagination.total_rows', { total: tableData.total })}
        </Text>
      </Group>
    </Group>
  );
});
