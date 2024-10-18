import { Table } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { observer } from 'mobx-react-lite';
import { AccessPermissionLabelMap } from '../../../../../api-caller/dashboard-permission.types';
import { PermissionModelInstance } from '../model';
import { PermissionAccessModelInstance } from '../model/permission-access-model';
import { AccessPermissionSelector } from './access-permission-selector';
import { AccountOrAPIKeySelector } from './account-or-apikey-selector';

const TableSx: EmotionSx = {
  tableLayout: 'fixed',
  width: '100%',
  'tr.fallback-row': {
    fontSize: '14px',
    height: '45px',
    td: {
      paddingLeft: '20px',
    },
    'td:nth-of-type(2)': {
      color: '#555',
    },
  },
  'thead tr th ': {
    paddingLeft: '20px',
  },
  'td .value-text': {
    fontSize: '14px',
    paddingLeft: '10px',
  },
};

const OpenUsageRow = () => (
  <Table.Tr className="fallback-row">
    <Table.Td>Everyone</Table.Td>
    <Table.Td>{AccessPermissionLabelMap.VIEW}</Table.Td>
  </Table.Tr>
);
const OpenEditingRow = () => (
  <Table.Tr className="fallback-row">
    <Table.Td>Authors, admins</Table.Td>
    <Table.Td>{AccessPermissionLabelMap.EDIT}</Table.Td>
  </Table.Tr>
);

interface IAccessRules {
  model: PermissionModelInstance;
}

export const AccessRulesTable = observer(({ model }: IAccessRules) => {
  const data = model.access;
  const getHandler = (access: PermissionAccessModelInstance) => (newID: string) => {
    const type = model.options.getTypeByID(newID);
    if (!type) {
      console.error(`Invalid ID[${newID}]`);
      return;
    }
    model.changeAccessID(access, newID, type);
  };

  return (
    <Table highlightOnHover sx={TableSx}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th style={{ width: '55%' }}>Account / API Key</Table.Th>
          <Table.Th style={{ width: '45%' }}>Access</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {[...data].map((d) => (
          <Table.Tr key={d.id}>
            <Table.Td>
              {model.isOwner ? (
                <AccountOrAPIKeySelector
                  value={d.id}
                  type={d.type}
                  onChange={getHandler(d)}
                  options={model.options.choosableOptions}
                  optionsLoading={model.options.loading}
                  disabled={!model.isOwner}
                />
              ) : (
                <span className="value-text">{d.name}</span>
              )}
            </Table.Td>
            <Table.Td>
              {model.isOwner ? (
                <AccessPermissionSelector value={d.permission} onChange={d.setPermission} />
              ) : (
                <span className="value-text">{AccessPermissionLabelMap[d.permission]}</span>
              )}
            </Table.Td>
          </Table.Tr>
        ))}
        {!model.usageRestricted && <OpenUsageRow />}
        {!model.editingRestricted && <OpenEditingRow />}
      </Table.Tbody>
    </Table>
  );
});
