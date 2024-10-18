import { Table } from '@mantine/core';
import { observer } from 'mobx-react-lite';

import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { MYSQLIndexInfoType, PGIndexInfoType } from '~/dashboard-editor/model/datasources/indexes';
import { DataSourceType } from '~/model';
import { TooltipValue } from './tooltip-value';

export const MySQLIndexesTable = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const { indexes } = dataSource;
  const data = indexes.data as MYSQLIndexInfoType[];
  return (
    <Table
      highlightOnHover
      fz={14}
      sx={{
        width: 'auto',
        minWidth: '950px',
        alignSelf: 'flex-start',
        flexGrow: 0,
        tableLayout: 'fixed',
        tbody: { fontFamily: 'monospace' },
      }}
    >
      <colgroup>
        <col style={{ width: 100 }} />
        <col style={{ minWidth: 300 }} />
        <col style={{ width: 150 }} />
        <col style={{ width: 150 }} />
        <col style={{ width: 250 }} />
      </colgroup>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Index Length</Table.Th>
          <Table.Th>Index Name</Table.Th>
          <Table.Th>Index Algorithm</Table.Th>
          <Table.Th>Unique</Table.Th>
          <Table.Th>Column Name</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((c) => (
          <Table.Tr key={c.index_name}>
            <Table.Td>{c.index_length}</Table.Td>
            <Table.Td>{c.index_name}</Table.Td>
            <Table.Td>{c.index_algorithm}</Table.Td>
            <Table.Td>{c.is_unique ? 'YES' : 'NO'}</Table.Td>
            <Table.Td>{c.column_name}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
});

export const PGIndexesTable = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const { indexes } = dataSource;
  const data = indexes.data as PGIndexInfoType[];
  return (
    <Table
      highlightOnHover
      fz={14}
      sx={{
        width: 'auto',
        minWidth: '850px',
        alignSelf: 'flex-start',
        flexGrow: 0,
        tableLayout: 'fixed',
        tbody: { fontFamily: 'monospace' },
      }}
    >
      <colgroup>
        <col style={{ minWidth: 300 }} />
        <col style={{ width: 150 }} />
        <col style={{ width: 100 }} />
        <col style={{ width: 100 }} />
        <col style={{ width: 100 }} />
        <col style={{ width: 100 }} />
      </colgroup>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Index Name</Table.Th>
          <Table.Th>Index Algorithm</Table.Th>
          <Table.Th>Unique</Table.Th>
          <Table.Th>Definition</Table.Th>
          <Table.Th>Condition</Table.Th>
          <Table.Th>Comment</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {data.map((c) => (
          <Table.Tr key={c.index_name}>
            <Table.Td>{c.index_name}</Table.Td>
            <Table.Td>{c.index_algorithm}</Table.Td>
            <Table.Td>{c.is_unique ? 'YES' : 'NO'}</Table.Td>
            <Table.Td>
              <TooltipValue value={c.index_definition} />
            </Table.Td>
            <Table.Td>
              <TooltipValue value={c.condition} />
            </Table.Td>
            <Table.Td>
              <TooltipValue value={c.comment} />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
});

export const IndexesTable = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const { indexes } = dataSource;

  if (indexes.loading || indexes.empty) {
    return null;
  }
  if (dataSource.type === DataSourceType.MySQL) {
    return <MySQLIndexesTable dataSource={dataSource} />;
  }
  if (dataSource.type === DataSourceType.Postgresql) {
    return <PGIndexesTable dataSource={dataSource} />;
  }

  return null;
});
