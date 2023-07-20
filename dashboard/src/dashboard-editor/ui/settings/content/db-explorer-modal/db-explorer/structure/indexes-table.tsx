import { Table } from '@mantine/core';
import { observer } from 'mobx-react-lite';

import { DataSourceModelInstance } from '~/dashboard-editor/model/datasources/datasource';
import { MYSQLIndexInfoType, PGIndexInfoType } from '~/dashboard-editor/model/datasources/indexes';
import { DataSourceType } from '~/dashboard-editor/model/queries/types';
import { TooltipValue } from './tooltip-value';

export const MySQLIndexesTable = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const { indexes } = dataSource;
  const data = indexes.data as MYSQLIndexInfoType[];
  return (
    <Table
      highlightOnHover
      fontSize={14}
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
      <thead>
        <tr>
          <th>Index Length</th>
          <th>Index Name</th>
          <th>Index Algorithm</th>
          <th>Unique</th>
          <th>Column Name</th>
        </tr>
      </thead>
      <tbody>
        {data.map((c) => (
          <tr key={c.index_name}>
            <td>{c.index_length}</td>
            <td>{c.index_name}</td>
            <td>{c.index_algorithm}</td>
            <td>{c.is_unique ? 'YES' : 'NO'}</td>
            <td>{c.column_name}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
});

export const PGIndexesTable = observer(({ dataSource }: { dataSource: DataSourceModelInstance }) => {
  const { indexes } = dataSource;
  const data = indexes.data as PGIndexInfoType[];
  return (
    <Table
      highlightOnHover
      fontSize={14}
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
      <thead>
        <tr>
          <th>Index Name</th>
          <th>Index Algorithm</th>
          <th>Unique</th>
          <th>Definition</th>
          <th>Condition</th>
          <th>Comment</th>
        </tr>
      </thead>
      <tbody>
        {data.map((c) => (
          <tr key={c.index_name}>
            <td>{c.index_name}</td>
            <td>{c.index_algorithm}</td>
            <td>{c.is_unique ? 'YES' : 'NO'}</td>
            <td>
              <TooltipValue value={c.index_definition} />
            </td>
            <td>
              <TooltipValue value={c.condition} />
            </td>
            <td>
              <TooltipValue value={c.comment} />
            </td>
          </tr>
        ))}
      </tbody>
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
