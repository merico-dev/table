import { Box, Button, Checkbox, Flex, Group, Stack, Table, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconCode, IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';

export const EditQueries = observer(() => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string[]>([]);
  const modals = useModals();
  const model = useEditDashboardContext();
  const navigateToQuery = (queryID: string) => {
    model.editor.setPath(['_QUERIES_', queryID]);
  };

  const removeUnusedQueriesWithConfirmation = () => {
    modals.openConfirmModal({
      title: 'Delete ununsed queries?',
      children: <Text size="sm">This action cannot be undone.</Text>,
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => model.content.removeUnusedQueries(),
      confirmProps: { color: 'red' },
      zIndex: 320,
    });
  };
  const downloadSchema = () => {
    model.content.queries.downloadSchema(value);
  };

  const allIDs = useMemo(() => {
    return model.content.queries.sortedList.map((q) => q.id);
  }, [model.content.queries.sortedList]);

  const selectAll = () => {
    setValue(allIDs);
  };
  const selectNone = () => {
    setValue([]);
  };

  const usages = model.content.queriesUsage;
  return (
    <Stack sx={{ height: '100%' }} spacing="sm" pb={'59px'}>
      <Box pt={9} pb={8} sx={{ borderBottom: '1px solid #eee' }}>
        <Text px="md" align="left" sx={{ userSelect: 'none', cursor: 'default' }}>
          {t('query.manage')}
        </Text>
      </Box>
      <Flex justify="space-between" align="center" px={12}>
        <Group position="left">
          <Button.Group>
            <Button variant="default" size="xs" onClick={selectAll}>
              {t('common.actions.select_all')}
            </Button>
            <Button variant="default" size="xs" onClick={selectNone}>
              {t('common.actions.clear_selection')}
            </Button>
          </Button.Group>
          <Button
            // variant="subtle"
            size="xs"
            color="blue"
            leftIcon={<IconCode size={14} />}
            disabled={value.length === 0}
            onClick={downloadSchema}
          >
            {t('common.actions.download_schema')}
          </Button>
        </Group>

        <Button
          variant="subtle"
          size="xs"
          color="red"
          leftIcon={<IconTrash size={14} />}
          disabled={!model.content.hasUnusedQueries}
          onClick={removeUnusedQueriesWithConfirmation}
        >
          Delete unused queries
        </Button>
      </Flex>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Checkbox.Group size="xs" value={value} onChange={setValue}>
          <Table fontSize="sm" highlightOnHover sx={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: '40px' }}></th>
                <th>{t('common.name')}</th>
                <th style={{ width: '200px' }}>Data Source</th>
                <th style={{ width: '100px', textAlign: 'right' }}>{t('common.type')}</th>
                <th style={{ width: '100px', textAlign: 'center' }}>Usage</th>
                <th style={{ width: '300px', paddingLeft: '24px' }}>{t('common.action')}</th>
              </tr>
            </thead>
            <tbody>
              {model.content.queries.sortedList.map((q) => {
                const usageCount = usages[q.id]?.length ?? 0;
                return (
                  <tr key={q.id}>
                    <td>
                      <Checkbox value={q.id} styles={{ input: { cursor: 'pointer' } }} />
                    </td>
                    <td>{q.name}</td>
                    <td>{q.key}</td>
                    <td style={{ textAlign: 'right' }}>{q.type}</td>
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
                      <Button variant="subtle" size="xs" onClick={() => navigateToQuery(q.id)}>
                        Open
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Checkbox.Group>
      </Box>
    </Stack>
  );
});
