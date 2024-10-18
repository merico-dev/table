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
        <ActionIcon variant="subtle" size={16}>
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
      <Group pt={styles.spacing} justify="space-between">
        <Alert>{t('global_sql_snippet.description')}</Alert>
        <AddSQLSnippet onSuccess={refresh} />
      </Group>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Table horizontalSpacing={styles.spacing} verticalSpacing={styles.spacing} fz={styles.size} highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('common.name')}</Table.Th>
              <Table.Th></Table.Th>
              <Table.Th>{t('common.created_at')}</Table.Th>
              <Table.Th>{t('common.updated_at')}</Table.Th>
              <Table.Th>{t('common.action')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {data.map((snippet) => {
              const { id, content, create_time, update_time } = snippet;
              return (
                <Table.Tr key={id}>
                  <Table.Td>{id}</Table.Td>
                  <Table.Td width={50}>
                    <HoverToSeeContent content={content} />
                  </Table.Td>
                  <Table.Td width={200}>{create_time}</Table.Td>
                  <Table.Td width={200}>{update_time}</Table.Td>
                  <Table.Td width={400}>
                    <Group justify="flex-start">
                      <UpdateSQLSnippet {...snippet} onSuccess={refresh} />
                      <DeleteSQLSnippet id={id} onSuccess={refresh} />
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
