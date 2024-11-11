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
      <Group pt={styles.spacing} justify="flex-end">
        <AddDataSource onSuccess={refresh} />
      </Group>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Table horizontalSpacing={styles.spacing} verticalSpacing={styles.spacing} fz={styles.size} highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('common.type')}</Table.Th>
              <Table.Th>{t('common.name')}</Table.Th>
              <Table.Th>{t('common.action')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((dataSource) => {
              const { id, key, type, is_preset } = dataSource;
              const isMericoMetricSystem = type === 'merico_metric_system';
              return (
                <Table.Tr key={key}>
                  <Table.Td width={230}>
                    <DataSourceIcon type={type} />
                  </Table.Td>
                  <Table.Td>{key}</Table.Td>
                  <Table.Td width={400}>
                    <Group justify="flex-start">
                      <EditDataSource dataSource={dataSource} onSuccess={refresh} styles={styles} />
                      <DeleteDataSource
                        isProtected={is_preset || isMericoMetricSystem}
                        id={id}
                        name={key}
                        onSuccess={refresh}
                        styles={styles}
                      />
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
