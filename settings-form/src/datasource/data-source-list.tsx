import { Box, Group, LoadingOverlay, Table } from '@mantine/core';
import { useRequest } from 'ahooks';
import { APICaller } from '../api-caller';
import { configureAPIClient } from '../api-caller/request';
import { useLoadMonacoEditor } from '../utils/load-monaco-editor';
import { AddDataSource } from './add-data-source';
import { DeleteDataSource } from './delete-data-source';
import { defaultStyles, IStyles } from './styles';
import { EditDataSource } from './edit-data-source';
import { DataSourceIcon } from './components/data-source-icon';
import { useApplyLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';

interface IDataSourceList {
  lang: string;
  styles?: IStyles;
  config: ISettingsFormConfig;
}

export function DataSourceList({ lang, styles = defaultStyles, config }: IDataSourceList) {
  useLoadMonacoEditor(config.monacoPath);
  configureAPIClient(config);
  useApplyLanguage(lang);

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
}
