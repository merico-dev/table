import { Group, Pagination, Select, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DataSourceModelInstance } from '~/model/datasources/datasource';

const limitOptions = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
];

const selectorStyles = {
  icon: {
    width: '50px',
    textAlign: 'center',
  },
  input: {
    '&.mantine-Input-withIcon': {
      paddingLeft: '50px',
    },
  },
};

export const PaginationControl = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const { tableData } = dataSource;
  return (
    <Group pt={10} px={10} position="apart">
      <Group position="left">
        {tableData.maxPage > 1 && (
          <Pagination
            size="sm"
            page={tableData.page}
            onChange={tableData.setPage}
            total={tableData.maxPage}
            withEdges={tableData.maxPage > 7}
            styles={{ item: { height: '30px' } }}
          />
        )}
        <Select
          icon={
            <Text ta="center" color="dimmed" size={14}>
              Limit
            </Text>
          }
          size="xs"
          // @ts-expect-error type error caused by !important
          styles={selectorStyles}
          data={limitOptions}
          value={String(tableData.limit)}
          onChange={(v) => tableData.setLimit(Number(v))}
        />
      </Group>
      <Group position="right">
        <Text color="dimmed" my={0} size={14}>
          Total {tableData.total} rows
        </Text>
      </Group>
    </Group>
  );
});
