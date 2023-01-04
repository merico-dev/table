import { Table } from '@mantine/core';
import { version } from '@devtable/dashboard';
import _ from 'lodash';

export const StatusTable = () => {
  return (
    <Table
      ml={20}
      mt={30}
      highlightOnHover
      sx={{
        width: '400px',
        'thead tr, tbody tr': {
          tr: {
            'th, td': {
              padding: '.6em 1em',
            },
          },
        },
        'thead th:first-of-type': { textAlign: 'left' },
        tbody: {
          'tr:not(:first-of-type)': { borderTop: '1px solid #dee2e6' },
          th: { textAlign: 'left' },
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
          <td>{version}</td>
        </tr>
        <tr>
          <th>@devtable/website</th>
          <td>{_.get(window, '@devtable/website:version', 'unknown')}</td>
        </tr>
      </tbody>
    </Table>
  );
};
