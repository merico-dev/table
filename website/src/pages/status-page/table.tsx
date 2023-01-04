import { LoadingOverlay, Table } from '@mantine/core';
import { getVersion as get_dashboard_version } from '@devtable/dashboard';
import { getVersion as get_settings_form_version } from '@devtable/settings-form';
import _ from 'lodash';
import { useRequest } from 'ahooks';
import { StatusAPI } from '../../api-caller/status';

export const StatusTable = () => {
  const { data: api_version, loading } = useRequest(StatusAPI.version);
  const website_version = _.get(window, '@devtable/website:version', 'unknown');
  const { data: dashboard_version } = useRequest(get_dashboard_version);
  const { data: settings_form_version } = useRequest(get_settings_form_version);
  return (
    <Table
      ml={20}
      mt={30}
      highlightOnHover
      sx={{
        width: '400px',
        'thead tr, tbody tr': {
          'th, td': {
            padding: '.6em 1em',
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
          <td style={{ position: 'relative' }}>
            <LoadingOverlay visible={loading} />
            {api_version}
          </td>
        </tr>
        <tr>
          <th>@devtable/dashboard</th>
          <td>{dashboard_version}</td>
        </tr>
        <tr>
          <th>@devtable/settings-form</th>
          <td>{settings_form_version}</td>
        </tr>
        <tr>
          <th>@devtable/website</th>
          <td>{website_version}</td>
        </tr>
      </tbody>
    </Table>
  );
};
