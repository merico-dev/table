import { Box, Button, Flex, Stack, Table, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';

export const EditQueries = observer(() => {
  const model = useEditDashboardContext();
  const navigateToQuery = (queryID: string) => {
    model.editor.setPath(['_QUERIES_', queryID]);
  };

  return (
    <Stack sx={{ height: '100%' }} spacing="sm" pb={'59px'}>
      <Box pt={9} pb={8} sx={{ borderBottom: '1px solid #eee' }}>
        <Text px="md" align="left" sx={{ userSelect: 'none', cursor: 'default' }}>
          Manage Queries
        </Text>
      </Box>
      <Flex justify="flex-end" align="center" px={12}>
        <Button variant="subtle" size="xs" color="red" leftIcon={<IconTrash size={14} />} disabled>
          Delete unused queries
        </Button>
      </Flex>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Table fontSize="sm" highlightOnHover sx={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th style={{ width: '200px' }}>Data Source</th>
              <th style={{ width: '100px' }}>Type</th>
              <th style={{ width: '100px' }}>Usage</th>
              <th style={{ width: '300px', paddingLeft: '24px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {model.content.queries.sortedList.map((q) => (
              <tr key={q.id}>
                <td>{q.name}</td>
                <td>{q.key}</td>
                <td>{q.type}</td>
                <td>{model.content.queriesUsage[q.id].length}</td>
                <td>
                  <Button variant="subtle" size="xs" onClick={() => navigateToQuery(q.id)}>
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Box>
    </Stack>
  );
});
