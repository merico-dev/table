import { Box, Group, LoadingOverlay, Table } from '@mantine/core';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { APICaller } from '../api-caller';
import { withEntry } from '../components';
import { AddAPIKey } from './add-api-key';
import { DeleteAPIKey } from './delete-api-key';
import { IStyles, defaultStyles } from './styles';

type Props = {
  styles?: IStyles;
};

export const APIKeyList = withEntry<Props>('APIKeyList', ({ styles = defaultStyles }: Props) => {
  const { t } = useTranslation();

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
      <Group pt={styles.spacing} justify="flex-end">
        <AddAPIKey onSuccess={refresh} initialRoleID={roleOptions?.[0]?.value ?? 'INACTIVE'} />
      </Group>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading || roleLoading} />
        <Table horizontalSpacing={styles.spacing} verticalSpacing={styles.spacing} fz={styles.size} highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('common.name')}</Table.Th>
              <Table.Th>{t('api_key.app_id')}</Table.Th>
              <Table.Th>{t('role.label')}</Table.Th>
              <Table.Th>{t('common.action')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((api_key) => {
              const { id, name, app_id, role_id } = api_key;
              return (
                <Table.Tr key={id}>
                  <Table.Td width={200}>{name}</Table.Td>
                  <Table.Td width={200}>{app_id}</Table.Td>
                  <Table.Td width={200}>{role_id}</Table.Td>
                  {/*
                  <Table.Td width={200}>{create_time}</Table.Td>
                  <Table.Td width={200}>{update_time}</Table.Td>
                  */}
                  <Table.Td width={200}>
                    <Group justify="flex-start">
                      <DeleteAPIKey id={id} name={name} onSuccess={refresh} />
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Box>
    </>
  );
});
