import { Box, Button, Flex, Stack, Table, Text } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';

export const EditQueries = observer(() => {
  const model = useEditDashboardContext();
  const navigateToQuery = (queryID: string) => {
    model.editor.setPath(['_QUERIES_', queryID]);
  };

  const usages = model.content.queriesUsage;
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
              <th style={{ width: '100px', textAlign: 'right' }}>Type</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Usage</th>
              <th style={{ width: '300px', paddingLeft: '24px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {model.content.queries.sortedList.map((q) => {
              const usageCount = usages[q.id].length;
              return (
                <tr key={q.id}>
                  <td>{q.name}</td>
                  <td>{q.key}</td>
                  <td style={{ textAlign: 'right' }}>{q.type}</td>
                  <td
                    style={{
                      color: usageCount > 2 ? '#ff0000' : '#000',
                      fontWeight: usageCount > 1 ? 'bold' : 'normal',
                      textAlign: 'center',
                    }}
                  >
                    {usageCount}
                  </td>
                  <td>
                    <Button variant="subtle" size="xs" onClick={() => navigateToQuery(q.id)}>
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
