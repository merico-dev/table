import { Box, Button, Checkbox, Flex, Group, Stack, Table, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconCode, IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';

export const EditSQLSnippets = observer(() => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string[]>([]);
  const modals = useModals();
  const model = useEditDashboardContext();
  const navigateToSnippet = (id: string) => {
    model.editor.setPath(['_SQL_SNIPPETS_', id]);
  };

  const removeUnusedSQLSnippetsWithConfirmation = () => {
    modals.openConfirmModal({
      title: 'Delete ununsed SQL snippets?',
      children: <Text size="sm">This action cannot be undone.</Text>,
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => model.content.removeUnusedSQLSnippets(),
      confirmProps: { color: 'red' },
      zIndex: 320,
    });
  };

  const downloadSchema = () => {
    model.content.sqlSnippets.downloadSchema(value);
  };

  const allKeys = useMemo(() => {
    return model.content.sqlSnippets.sortedList.map((q) => q.key);
  }, [model.content.sqlSnippets.sortedList]);

  const selectAll = () => {
    setValue(allKeys);
  };
  const selectNone = () => {
    setValue([]);
  };

  const usages = model.content.sqlSnippetsUsage;
  return (
    <Stack sx={{ height: '100%' }} gap="sm" pb={'59px'}>
      <Box pt={9} pb={8} sx={{ borderBottom: '1px solid #eee' }}>
        <Text size="sm" px="md" ta="left" sx={{ userSelect: 'none', cursor: 'default' }}>
          {t('sql_snippet.manage')}
        </Text>
      </Box>
      <Flex justify="space-between" align="center" px={12}>
        <Group justify="flex-start">
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
            leftSection={<IconCode size={14} />}
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
          leftSection={<IconTrash size={14} />}
          disabled={!model.content.hasUnusedSQLSnippets}
          onClick={removeUnusedSQLSnippetsWithConfirmation}
        >
          {t('sql_snippet.delete_unused')}
        </Button>
      </Flex>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Checkbox.Group size="xs" value={value} onChange={setValue}>
          <Table fz="sm" highlightOnHover sx={{ tableLayout: 'fixed' }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: '40px' }}></Table.Th>
                <Table.Th>{t('common.key')}</Table.Th>
                <Table.Th style={{ width: '100px', textAlign: 'center' }}>{t('sql_snippet.usage.label')}</Table.Th>
                <Table.Th style={{ width: '300px', paddingLeft: '24px' }}>{t('common.action')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {model.content.sqlSnippets.sortedList.map((s) => {
                const usageCount = usages[s.key]?.length ?? 0;
                return (
                  <Table.Tr key={s.key}>
                    <Table.Td>
                      <Checkbox value={s.key} styles={{ input: { cursor: 'pointer' } }} />
                    </Table.Td>
                    <Table.Td>{s.key}</Table.Td>
                    <Table.Td
                      style={{
                        color: usageCount === 0 ? '#ff0000' : '#000',
                        fontWeight: usageCount === 0 ? 'bold' : 'normal',
                        textAlign: 'center',
                      }}
                    >
                      {usageCount}
                    </Table.Td>
                    <Table.Td>
                      <Button variant="subtle" size="xs" onClick={() => navigateToSnippet(s.key)}>
                        {t('common.actions.open')}
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Checkbox.Group>
      </Box>
    </Stack>
  );
});
