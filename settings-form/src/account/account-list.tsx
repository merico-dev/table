import { Box, Group, LoadingOverlay, Table } from '@mantine/core';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { APICaller } from '../api-caller';
import { withEntry } from '../components';
import { AddAccount } from './add-account';
import { DeleteAccount } from './delete-account';
import { EditAccount } from './edit-account';
import { IStyles, defaultStyles } from './styles';

type Props = {
  styles?: IStyles;
};

export const AccountList = withEntry<Props>('AccountList', ({ styles = defaultStyles }: Props) => {
  const { t } = useTranslation();

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
        <AddAccount onSuccess={refresh} initialRoleID={roleOptions?.[0]?.value ?? 'INACTIVE'} />
      </Group>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading || roleLoading} />
        <Table horizontalSpacing={styles.spacing} verticalSpacing={styles.spacing} fz={styles.size} highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('account.username')}</Table.Th>
              <Table.Th>{t('account.email')}</Table.Th>
              <Table.Th>{t('role.label')}</Table.Th>
              {/* <Table.Th>Created at</Table.Th>
              <Table.Th>Updated at</Table.Th> */}
              <Table.Th>{t('common.action')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((account) => {
              const { id, name, email, role_id } = account;
              return (
                <Table.Tr key={id}>
                  <Table.Td width={200}>{name}</Table.Td>
                  <Table.Td width={200}>{email}</Table.Td>
                  <Table.Td width={200}>{role_id}</Table.Td>
                  {/*
                  <Table.Td width={200}>{create_time}</Table.Td>
                  <Table.Td width={200}>{update_time}</Table.Td>
                  */}
                  <Table.Td width={200}>
                    <Group justify="flex-start">
                      <EditAccount account={account} onSuccess={refresh} />
                      <DeleteAccount id={id} name={name} onSuccess={refresh} />
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
