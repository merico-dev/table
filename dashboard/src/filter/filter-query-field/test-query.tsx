import { Box, Button, Group, LoadingOverlay, Stack, Table, Text } from '@mantine/core';
import { useRequest } from 'ahooks';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { queryByStaticSQL } from '../../api-caller';
import { IFilterOptionQuery } from '../../model/filters/filter/common';

function DataTable({ data }: { data: any[] }) {
  if (data.length === 0) {
    return <Table></Table>;
  }
  return (
    <Table>
      <thead>
        <tr>
          {Object.keys(data?.[0]).map((label) => (
            <th key={label}>
              <Text weight={700} color="#000">
                {label}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0, 3).map((row: Record<string, any>, index: number) => (
          <tr key={`row-${index}`}>
            {Object.values(row).map((v: any, i) => (
              <td key={`${v}--${i}`}>
                <Group sx={{ '&, .mantine-Text-root': { fontFamily: 'monospace' } }}>
                  <Text>{v}</Text>
                </Group>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {data.length > 3 && (
        <tfoot>
          <tr>
            <td colSpan={Object.keys(data?.[0]).length}>
              <Text color="gray" size="sm">
                {data.length - 3} more row(s) hidden
              </Text>
            </td>
          </tr>
        </tfoot>
      )}
    </Table>
  );
}

interface ITestQuery {
  query: IFilterOptionQuery;
}
export const TestQuery = observer(function _FilterQueryField({ query }: ITestQuery) {
  const {
    data = [],
    loading,
    refresh,
  } = useRequest(queryByStaticSQL(query), {
    refreshDeps: [query],
  });

  return (
    <Stack my={0}>
      <Group position="apart">
        <Text size="md" pl="sm">
          Fetched Data
        </Text>
        <Button size="xs" onClick={refresh} disabled={!query.sql || !query.key}>
          Retry
        </Button>
      </Group>
      <Box sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} exitTransitionDuration={0} />
        <DataTable data={data} />
      </Box>
    </Stack>
  );
});
