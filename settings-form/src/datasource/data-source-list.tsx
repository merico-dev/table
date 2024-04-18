import { Box, Group, LoadingOverlay, Table } from '@mantine/core';
import { useRequest } from 'ahooks';
import { useTranslation } from 'react-i18next';
import { APICaller } from '../api-caller';
import { withEntry } from '../components';
import { AddDataSource } from './add-data-source';
import { DataSourceIcon } from './components/data-source-icon';
import { DeleteDataSource } from './delete-data-source';
import { EditDataSource } from './edit-data-source';
import { IStyles, defaultStyles } from './styles';

type Props = {
  styles?: IStyles;
};

export const DataSourceList = withEntry<Props>('DataSourceList', ({ styles = defaultStyles }: Props) => {
  const { t } = useTranslation();
  const {
    data = [],
    loading,
    refresh,
  } = useRequest(
    async () => {
      const { data } = await APICaller.datasource.list();
      return data;
    },
    {
      refreshDeps: [],
    },
  );

  return (
    <>
      <Group pt={styles.spacing} position="right">
        <AddDataSource onSuccess={refresh} />
      </Group>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Table
          horizontalSpacing={styles.spacing}
          verticalSpacing={styles.spacing}
          fontSize={styles.size}
          highlightOnHover
        >
          <thead>
            <tr>
              <th>{t('settings.common.type')}</th>
              <th>{t('settings.common.name')}</th>
              <th>{t('settings.common.action')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((dataSource) => {
              const { id, key, type, is_preset } = dataSource;
              return (
                <tr key={key}>
                  <td width={200}>
                    <DataSourceIcon type={type} />
                  </td>
                  <td>{key}</td>
                  <td width={400}>
                    <Group position="left">
                      <EditDataSource dataSource={dataSource} onSuccess={refresh} styles={styles} />
                      <DeleteDataSource
                        isProtected={is_preset}
                        id={id}
                        name={key}
                        onSuccess={refresh}
                        styles={styles}
                      />
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
});
