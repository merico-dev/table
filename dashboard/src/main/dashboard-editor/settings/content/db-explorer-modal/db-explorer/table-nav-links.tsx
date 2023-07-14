import { Box, NavLink } from '@mantine/core';
import { IconDatabase, IconEye, IconTable } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { DataSourceModelInstance } from '~/model/datasources/datasource';
import { TableInfoType } from '~/model/datasources/tables';
import { LoadingSkeleton } from './structure/loading-skeleton';

function TableIcon({ table_type }: { table_type: TableInfoType['table_type'] }) {
  if (table_type === 'VIEW') {
    return <IconEye size={14} />;
  }
  if (table_type === 'BASE TABLE') {
    return <IconTable size={14} />;
  }
  return null;
}

export const TableNavLinks = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const { tables } = dataSource;

  if (tables.loading) {
    return <LoadingSkeleton height={'24px'} lastWidth="50%" count={15} />;
  }
  return (
    <Box h="100%" sx={{ overflow: 'auto', '.mantine-NavLink-label': { fontFamily: 'monospace' } }}>
      {Object.entries(tables.data).map(([table_schema, table_infos]) => (
        <NavLink
          key={table_schema}
          label={table_schema}
          icon={<IconDatabase size={14} />}
          defaultOpened={dataSource.table_schema === table_schema}
          pl={0}
          childrenOffset={14}
        >
          {table_infos.map((info) => (
            <NavLink
              key={info.table_name}
              label={info.table_name}
              icon={<TableIcon table_type={info.table_type} />}
              onClick={() => {
                dataSource.setKeywords(table_schema, info.table_name);
              }}
              active={dataSource.table_name === info.table_name}
            />
          ))}
        </NavLink>
      ))}
    </Box>
  );
});
