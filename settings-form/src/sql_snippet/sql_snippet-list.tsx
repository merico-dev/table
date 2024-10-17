import { ActionIcon, Alert, Box, Group, HoverCard, LoadingOverlay, Table } from '@mantine/core';
import { CodeHighlight } from '@mantine/code-highlight';
import { useRequest } from 'ahooks';
import { APICaller } from '../api-caller';
import { AddSQLSnippet } from './add-sql_snippet';
import { DeleteSQLSnippet } from './delete-sql_snippet';
import { IStyles, defaultStyles } from './styles';

import { IconEye } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { withEntry } from '../components';
import { UpdateSQLSnippet } from './update-sql_snippet';

function HoverToSeeContent({ content }: { content: string }) {
  return (
    <HoverCard width="60vw" shadow="md">
      <HoverCard.Target>
        <ActionIcon size={16}>
          <IconEye />
        </ActionIcon>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <CodeHighlight code={content} language="sql" withCopyButton={false} />
        {/* <MinimalMonacoEditor height="600px" value={content} onChange={_.noop} /> */}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

type Props = {
  styles?: IStyles;
};

export const SQLSnippetList = withEntry<Props>('DataSourceList', ({ styles = defaultStyles }: Props) => {
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
      <Group pt={styles.spacing} justify="apart">
        <Alert>{t('global_sql_snippet.description')}</Alert>
        <AddSQLSnippet onSuccess={refresh} />
      </Group>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Table horizontalSpacing={styles.spacing} verticalSpacing={styles.spacing} fz={styles.size} highlightOnHover>
          <thead>
            <tr>
              <th>{t('common.name')}</th>
              <th></th>
              <th>{t('common.created_at')}</th>
              <th>{t('common.updated_at')}</th>
              <th>{t('common.action')}</th>
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
                    <Group justify="flex-start">
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
});
