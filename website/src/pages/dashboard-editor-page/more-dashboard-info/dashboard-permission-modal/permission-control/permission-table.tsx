import { Table, Text } from '@mantine/core';
import { PermissionResourceType } from '../../../../../api-caller/dashboard-permission.types';
import { AccountTypeIcon } from '../../../../../components/account-type-icon';

const TableStyles = {
  root: {
    tableLayout: 'fixed',
    width: '100%',
  },
};

const OpenUsageRow = () => (
  <tr>
    <td>
      <Text fw={'bold'}>Everyone</Text>
    </td>
    <td>Use</td>
  </tr>
);
const OpenEditingRow = () => (
  <tr>
    <td>
      <Text fw={'bold'}>Everyone</Text>
    </td>
    <td>Edit</td>
  </tr>
);
const OpenRemovalRow = () => (
  <tr>
    <td>
      <Text fw={'bold'}>Everyone</Text>
    </td>
    <td>Remove</td>
  </tr>
);

interface IPermissionTable {
  data: PermissionResourceType[];
}

export const PermissionTable = ({ data }: IPermissionTable) => {
  const usageRestricted = data.some((d) => d.permission === 'VIEW');
  const editingRestricted = data.some((d) => d.permission === 'EDIT');
  const removalRestricted = data.some((d) => d.permission === 'REMOVE');
  return (
    <Table fontSize={14} highlightOnHover styles={TableStyles}>
      <thead>
        <tr>
          <th style={{ width: '50%' }}>Account / API Key</th>
          <th style={{ width: '50%' }}>Permission</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => {
          return (
            <tr key={d.id}>
              <td>
                <AccountTypeIcon type={d.type} />
                <Text size={14}>{d.id}</Text>
              </td>
              <td>
                <Text size={14}>{d.permission}</Text>
              </td>
            </tr>
          );
        })}
        {!usageRestricted && <OpenUsageRow />}
        {!editingRestricted && <OpenEditingRow />}
        {!removalRestricted && <OpenRemovalRow />}
      </tbody>
    </Table>
  );
};
