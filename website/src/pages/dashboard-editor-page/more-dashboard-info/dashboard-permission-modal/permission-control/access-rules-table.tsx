import { Sx, Table } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { AccessPermissionLabelMap } from '../../../../../api-caller/dashboard-permission.types';
import { AccountTypeIcon } from '../../../../../components/account-type-icon';
import { PermissionModelInstance } from '../model';
import { AccessPermissionSelector } from './access-permission-selector';
import { AccountOrAPIKeySelector } from './account-or-apikey-selector';

const TableSx: Sx = {
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
  <tr className="fallback-row">
    <td />
    <td>Everyone</td>
    <td>{AccessPermissionLabelMap.VIEW}</td>
  </tr>
);
const OpenEditingRow = () => (
  <tr className="fallback-row">
    <td />
    <td>Authors, admins</td>
    <td>{AccessPermissionLabelMap.EDIT}</td>
  </tr>
);

interface IAccessRules {
  model: PermissionModelInstance;
}

export const AccessRulesTable = observer(({ model }: IAccessRules) => {
  const data = model.access;

  return (
    <Table highlightOnHover sx={TableSx}>
      <thead>
        <tr>
          <th style={{ width: '50px' }} />
          <th style={{ width: '55%' }}>Account / API Key</th>
          <th style={{ width: 'calc(45% - 50px)' }}>Access</th>
        </tr>
      </thead>
      <tbody>
        {[...data].map((d) => (
          <tr key={d.id}>
            <td>
              <AccountTypeIcon type={d.type} />
            </td>
            <td>
              {model.isOwner ? (
                <AccountOrAPIKeySelector
                  value={d.id}
                  onChange={d.setID}
                  options={model.options.choosableOptions}
                  optionsLoading={model.options.loading}
                  disabled={!model.isOwner}
                />
              ) : (
                <span className="value-text">{d.name}</span>
              )}
            </td>
            <td>
              {model.isOwner ? (
                <AccessPermissionSelector value={d.permission} onChange={d.setPermission} />
              ) : (
                <span className="value-text">{AccessPermissionLabelMap[d.permission]}</span>
              )}
            </td>
          </tr>
        ))}
        {!model.usageRestricted && <OpenUsageRow />}
        {!model.editingRestricted && <OpenEditingRow />}
      </tbody>
    </Table>
  );
});
