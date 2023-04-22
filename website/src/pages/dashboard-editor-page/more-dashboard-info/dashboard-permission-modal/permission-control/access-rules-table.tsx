import { Table, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { AccountTypeIcon } from '../../../../../components/account-type-icon';
import { PermissionModelInstance } from '../model';
import { AccountOrAPIKeySelector } from './account-or-apikey-selector';
import { useRequest } from 'ahooks';
import { AccountAPI } from '../../../../../api-caller/account';
import { AccountOrAPIKeyOptionType } from '../../../../../api-caller/dashboard-permission.types';

const TableStyles = {
  root: {
    tableLayout: 'fixed',
    width: '100%',
  },
};

const OpenUsageRow = () => (
  <tr>
    <td />
    <td>
      <Text fw={'bold'}>Everyone</Text>
    </td>
    <td>Use</td>
  </tr>
);
const OpenEditingRow = () => (
  <tr>
    <td />
    <td>
      <Text fw={'bold'}>Everyone</Text>
    </td>
    <td>Edit</td>
  </tr>
);
const OpenRemovalRow = () => (
  <tr>
    <td />
    <td>
      <Text fw={'bold'}>Everyone</Text>
    </td>
    <td>Remove</td>
  </tr>
);

interface IAccessRules {
  model: PermissionModelInstance;
}

export const AccessRulesTable = observer(({ model }: IAccessRules) => {
  const data = model.access;
  const usageRestricted = data.some((d) => d.permission === 'VIEW');
  const editingRestricted = data.some((d) => d.permission === 'EDIT');
  const removalRestricted = data.some((d) => d.permission === 'REMOVE');

  const { data: options, loading } = useRequest(
    async (): Promise<AccountOrAPIKeyOptionType[]> => {
      const accountResp = await AccountAPI.list();
      const accounts = accountResp.data.map((d) => ({ label: d.name, value: d.id, type: 'ACCOUNT' } as const));
      return accounts;
    },
    { refreshDeps: [] },
  );

  return (
    <Table fontSize={14} highlightOnHover styles={TableStyles}>
      <thead>
        <tr>
          <th style={{ width: '40px' }} />
          <th style={{ width: '60%' }}>Account / API Key</th>
          <th style={{ width: 'calc(40% - 40px)' }}>Permission</th>
        </tr>
      </thead>
      <tbody>
        {[...data].map((d) => (
          <tr key={d.id}>
            <td>
              <AccountTypeIcon type={d.type} />
            </td>
            <td>
              <AccountOrAPIKeySelector value={d.id} onChange={d.setID} options={options} optionsLoading={loading} />
            </td>
            <td>
              <Text size={14}>{d.permission}</Text>
            </td>
          </tr>
        ))}
        {!usageRestricted && <OpenUsageRow />}
        {!editingRestricted && <OpenEditingRow />}
        {!removalRestricted && <OpenRemovalRow />}
      </tbody>
    </Table>
  );
});
