import { Box, Group, LoadingOverlay, Table } from '@mantine/core';
import { useRequest } from 'ahooks';
import { APICaller } from '../api-caller';
import { configureAPIClient } from '../api-caller/request';
import { AddAccount } from './add-account';
import { DeleteAccount } from './delete-account';
import { EditAccount } from './edit-account';
import { IStyles, defaultStyles } from './styles';
import { useApplyLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';

interface IAccountList {
  lang: string;
  styles?: IStyles;
  config: ISettingsFormConfig;
}

export function AccountList({ lang, styles = defaultStyles, config }: IAccountList) {
  configureAPIClient(config);
  useApplyLanguage(lang);
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
      <Group pt={styles.spacing} position="right">
        <AddAccount onSuccess={refresh} initialRoleID={roleOptions?.[0]?.value ?? 'INACTIVE'} />
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
              <th>{t('account.username')}</th>
              <th>{t('account.email')}</th>
              <th>{t('role.label')}</th>
              {/* <th>Created at</th>
              <th>Updated at</th> */}
              <th>{t('common.action')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((account) => {
              const { id, name, email, role_id } = account;
              return (
                <tr key={id}>
                  <td width={200}>{name}</td>
                  <td width={200}>{email}</td>
                  <td width={200}>{role_id}</td>
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
