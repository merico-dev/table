import { getVersion as get_dashboard_version } from '@devtable/dashboard';
import { getVersion as get_settings_form_version } from '@devtable/settings-form';
import { LoadingOverlay, Table } from '@mantine/core';
import { useRequest } from 'ahooks';
import { StatusAPI } from '../../api-caller/status';

const get_website_version = () => import('../../../package.json').then(({ version }) => version);

export const StatusTable = () => {
  const { data: api_version, loading } = useRequest(StatusAPI.version);
  const { data: dashboard_version } = useRequest(get_dashboard_version);
  const { data: settings_form_version } = useRequest(get_settings_form_version);
  const { data: website_version } = useRequest(get_website_version);
  return (
    <Table
      ml={20}
      mt={30}
      highlightOnHover
      sx={{
        width: '400px',
        '&': {
          'thead tr, tbody tr': {
            'th, td': {
              padding: '.6em 1em',
            },
          },
          'thead th:first-of-type': { textAlign: 'left' },
          tbody: {
            'tr:not(:first-of-type)': { borderTop: '1px solid #dee2e6' },
            th: { textAlign: 'left' },
            'th, td': {
              fontFamily: 'monospace !important',
            },
          },
        },
      }}
    >
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ width: '60%' }}>Package</Table.Th>
          <Table.Th>Version</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        <Table.Tr>
          <Table.Th>@devtable/api</Table.Th>
          <Table.Td style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} />
            {api_version?.semver}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>@devtable/dashboard</Table.Th>
          <Table.Td>{dashboard_version}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>@devtable/settings-form</Table.Th>
          <Table.Td>{settings_form_version}</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>@devtable/website</Table.Th>
          <Table.Td>{website_version}</Table.Td>
        </Table.Tr>
      </Table.Tbody>
    </Table>
  );
};
