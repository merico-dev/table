import { Box, Table } from '@mantine/core';

export const StatusTable = () => {
  return (
    <Table
      mt={30}
      highlightOnHover
      sx={{
        width: '400px',
        'thead, tbody': {
          tr: {
            'th, td': {
              padding: '.6em 1em',
            },
          },
        },
        'thead th:first-of-type': { textAlign: 'left' },
        tbody: {
          'tr:not(:first-of-type)': { borderTop: '1px solid #dee2e6' },
          th: { textAlign: 'left', fontWeight: 'semibold' },
        },
      }}
    >
      <thead>
        <tr>
          <th style={{ width: '60%' }}>Package</th>
          <th>Version</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>@devtable/api</th>
          <td>1.2.3</td>
        </tr>
        <tr>
          <th>@devtable/dashboard</th>
          <td>1.2.3</td>
        </tr>
        <tr>
          <th>@devtable/website</th>
          <td>1.2.3</td>
        </tr>
      </tbody>
    </Table>
  );
};
