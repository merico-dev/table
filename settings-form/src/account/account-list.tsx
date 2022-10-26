import { Box, LoadingOverlay, Table, Group } from '@mantine/core';
import { useRequest } from 'ahooks';
import React, { useMemo } from 'react';
import { APICaller } from '../api-caller';
import { APIClient } from '../api-caller/request';
import { AddAccount } from './add-account';
import { DeleteAccount } from './delete-account';
import { EditAccount } from './edit-account';
import { defaultStyles, IStyles } from './styles';
import { ISettingsFormConfig } from './types';

interface IAccountList {
  styles?: IStyles;
  config: ISettingsFormConfig;
}

export function AccountList({ styles = defaultStyles, config }: IAccountList) {
  const {
    data = [],
    loading,
    refresh,
  } = useRequest(
    async () => {
      const { data } = await APICaller.account.list();
      return data;
    },
    {
      refreshDeps: [],
    },
  );
  const { data: roleOptions = [], loading: roleLoading } = useRequest(
    async () => {
      const data = await APICaller.role.list();
      return data.map((d) => ({
        label: d.name,
        value: d.id,
        description: d.description,
        disabled: d.id === 50, // SUPERADMIN
      }));
    },
    {
      refreshDeps: [],
    },
  );

  const roleNameMap = useMemo(() => {
    return roleOptions.reduce((m, r) => {
      m.set(r.value, r.label);
      return m;
    }, new Map<number, string>());
  }, [roleOptions]);

  const getRoleName = (id: number) => {
    return roleNameMap.get(id) ?? id;
  };

  if (APIClient.baseURL !== config.apiBaseURL) {
    APIClient.baseURL = config.apiBaseURL;
  }

  return (
    <>
      <Group pt={styles.spacing} position="right">
        <AddAccount onSuccess={refresh} initialRoleID={roleOptions?.[0]?.value ?? 0} />
      </Group>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading || roleLoading} />
        <Table
          horizontalSpacing={styles.spacing}
          verticalSpacing={styles.spacing}
          fontSize={styles.size}
          highlightOnHover
        >
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              {/* <th>Created at</th>
              <th>Updated at</th> */}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((account) => {
              const { id, name, email, role_id } = account;
              return (
                <tr key={id}>
                  <td width={200}>{name}</td>
                  <td width={200}>{email}</td>
                  <td width={200}>{getRoleName(role_id)}</td>
                  {/* <td width={200}>{create_time}</td>
                <td width={200}>{update_time}</td> */}
                  <td width={200}>
                    <Group position="left">
                      <EditAccount account={account} onSuccess={refresh} />
                      <DeleteAccount id={id} name={name} onSuccess={refresh} />
                    </Group>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Box>
    </>
  );
}
