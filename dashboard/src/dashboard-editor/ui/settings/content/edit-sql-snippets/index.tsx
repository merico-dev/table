import { Box, Button, Flex, Stack, Table, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';

export const EditSQLSnippets = observer(() => {
  const modals = useModals();
  const model = useEditDashboardContext();
  const navigateToSnippet = (id: string) => {
    model.editor.setPath(['_SQL_SNIPPETS_', id]);
  };

  const removeUnusedSQLSnippetsWithConfirmation = () => {
    modals.openConfirmModal({
      title: 'Delete ununsed SQL snippets?',
      children: <Text size="sm">This action cannot be undone.</Text>,
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      // onConfirm: () => model.content.removeUnusedQueries(),
      onConfirm: _.noop,
      confirmProps: { color: 'red' },
      zIndex: 320,
    });
  };

  const usages = model.content.sqlSnippetsUsage;
  return (
    <Stack sx={{ height: '100%' }} spacing="sm" pb={'59px'}>
      <Box pt={9} pb={8} sx={{ borderBottom: '1px solid #eee' }}>
        <Text px="md" align="left" sx={{ userSelect: 'none', cursor: 'default' }}>
          Manage Queries
        </Text>
      </Box>
      <Flex justify="flex-end" align="center" px={12}>
        <Button
          variant="subtle"
          size="xs"
          color="red"
          leftIcon={<IconTrash size={14} />}
          disabled={!model.content.hasUnusedSQLSnippets}
          onClick={removeUnusedSQLSnippetsWithConfirmation}
        >
          Delete unused SQL snippets
        </Button>
      </Flex>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Table fontSize="sm" highlightOnHover sx={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th>Key</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Usage</th>
              <th style={{ width: '300px', paddingLeft: '24px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {model.content.sqlSnippets.sortedList.map((s) => {
              const usageCount = usages[s.key]?.length ?? 0;
              return (
                <tr key={s.key}>
                  <td>{s.key}</td>
                  <td
                    style={{
                      color: usageCount === 0 ? '#ff0000' : '#000',
                      fontWeight: usageCount === 0 ? 'bold' : 'normal',
                      textAlign: 'center',
                    }}
                  >
                    {usageCount}
                  </td>
                  <td>
                    <Button variant="subtle" size="xs" onClick={() => navigateToSnippet(s.key)}>
                      Open
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Box>
    </Stack>
  );
});
