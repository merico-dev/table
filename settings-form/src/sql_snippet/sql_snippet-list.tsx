import { ActionIcon, Box, Group, HoverCard, LoadingOverlay, Table } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useRequest } from 'ahooks';
import { APICaller } from '../api-caller';
import { configureAPIClient } from '../api-caller/request';
import { AddSQLSnippet } from './add-sql_snippet';
import { DeleteSQLSnippet } from './delete-sql_snippet';
import { IStyles, defaultStyles } from './styles';

import { IconEye } from '@tabler/icons-react';
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
        <Prism language="sql" noCopy withLineNumbers>
          {content}
        </Prism>
        {/* <MinimalMonacoEditor height="600px" value={content} onChange={_.noop} /> */}
      </HoverCard.Dropdown>
    </HoverCard>
  );
}

interface ISQLSnippetList {
  styles?: IStyles;
  config: ISettingsFormConfig;
}

export function SQLSnippetList({ styles = defaultStyles, config }: ISQLSnippetList) {
  configureAPIClient(config);

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
      <Group pt={styles.spacing} position="right">
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
              <th>Name</th>
              <th></th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
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
