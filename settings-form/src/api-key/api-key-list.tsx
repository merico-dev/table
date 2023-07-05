import { Box, Group, LoadingOverlay, Table } from '@mantine/core';
import { useRequest } from 'ahooks';
import { APICaller } from '../api-caller';
import { configureAPIClient } from '../api-caller/request';
import { AddAPIKey } from './add-api-key';
import { DeleteAPIKey } from './delete-api-key';
import { IStyles, defaultStyles } from './styles';

interface IAPIKeyList {
  styles?: IStyles;
  config: ISettingsFormConfig;
}

export function APIKeyList({ styles = defaultStyles, config }: IAPIKeyList) {
  configureAPIClient(config);

  const {
    data = [],
    loading,
    refresh,
  } = useRequest(
    async () => {
      const { data } = await APICaller.api_key.list();
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
        label: d.id,
        value: d.id,
        description: d.description,
        disabled: d.id === 'SUPERADMIN',
      }));
    },
    {
      refreshDeps: [],
    },
  );

  return (
    <>
      <Group pt={styles.spacing} position="right">
        <AddAPIKey onSuccess={refresh} initialRoleID={roleOptions?.[0]?.value ?? 'INACTIVE'} />
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
              <th>Name</th>
              <th>APP ID</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((api_key) => {
              const { id, name, app_id, role_id } = api_key;
              return (
                <tr key={id}>
                  <td width={200}>{name}</td>
                  <td width={200}>{app_id}</td>
                  <td width={200}>{role_id}</td>
                  {/* <td width={200}>{create_time}</td>
                <td width={200}>{update_time}</td> */}
                  <td width={200}>
                    <Group position="left">
                      <DeleteAPIKey id={id} name={name} onSuccess={refresh} />
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
