import { ActionIcon, Alert, Box, Group, HoverCard, LoadingOverlay, Table } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useRequest } from 'ahooks';
import { APICaller } from '../api-caller';
import { configureAPIClient } from '../api-caller/request';
import { AddSQLSnippet } from './add-sql_snippet';
import { DeleteSQLSnippet } from './delete-sql_snippet';
import { IStyles, defaultStyles } from './styles';

import { IconEye } from '@tabler/icons-react';
import { UpdateSQLSnippet } from './update-sql_snippet';
import { useApplyLanguage } from '../i18n';
import { useTranslation } from 'react-i18next';

function HoverToSeeContent({ content }: { content: string }) {
  return (
    <HoverCard width="60vw" shadow="md">
      <HoverCard.Target>
        <ActionIcon size={16}>
          <IconEye />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <Prism language="sql" noCopy withLineNumbers>
          {content}
        </Prism>
        {/* <MinimalMonacoEditor height="600px" value={content} onChange={_.noop} /> */}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

interface ISQLSnippetList {
  lang: string;
  styles?: IStyles;
  config: ISettingsFormConfig;
}

export function SQLSnippetList({ lang, styles = defaultStyles, config }: ISQLSnippetList) {
  configureAPIClient(config);
  useApplyLanguage(lang);
  const { t } = useTranslation();

  const {
    data = [],
    loading,
    refresh,
  } = useRequest(
    async () => {
      const { data } = await APICaller.sql_snippet.list({
        pagination: {
          page: 1,
          pagesize: 10,
        },
      });
      return data;
    },
    {
      refreshDeps: [],
    },
  );

  return (
    <>
      <Group pt={styles.spacing} position="apart">
        <Alert>{t('settings.global_sql_snippet.description')}</Alert>
        <AddSQLSnippet onSuccess={refresh} />
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
              <th>{t('settings.common.name')}</th>
              <th></th>
              <th>{t('settings.common.created_at')}</th>
              <th>{t('settings.common.updated_at')}</th>
              <th>{t('settings.common.action')}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((snippet) => {
              const { id, content, create_time, update_time } = snippet;
              return (
                <tr key={id}>
                  <td>{id}</td>
                  <td width={50}>
                    <HoverToSeeContent content={content} />
                  </td>
                  <td width={200}>{create_time}</td>
                  <td width={200}>{update_time}</td>
                  <td width={400}>
                    <Group position="left">
                      <UpdateSQLSnippet {...snippet} onSuccess={refresh} />
                      <DeleteSQLSnippet id={id} onSuccess={refresh} />
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
