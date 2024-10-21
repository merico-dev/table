import { Box, Button, Checkbox, Flex, Group, Stack, Table, Text } from '@mantine/core';
import { IconCode } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { filterTypeNames } from '~/components/filter/filter-settings/filter-setting';
import { useEditDashboardContext } from '~/contexts';

export const EditFilters = observer(() => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string[]>([]);
  const model = useEditDashboardContext();
  const navigateToFilter = (filterID: string) => {
    model.editor.setPath(['_FILTERS_', filterID]);
  };

  const downloadSchema = () => {
    model.content.filters.downloadSchema(value);
  };

  const allIDs = useMemo(() => {
    return model.content.filters.sortedList.map((q) => q.id);
  }, [model.content.filters.sortedList]);

  const selectAll = () => {
    setValue(allIDs);
  };
  const selectNone = () => {
    setValue([]);
  };

  return (
    <Stack sx={{ height: '100%' }} gap="sm" pb={'59px'}>
      <Box pt={9} pb={8} sx={{ borderBottom: '1px solid #eee' }}>
        <Text size="sm" px="md" ta="left" sx={{ userSelect: 'none', cursor: 'default' }}>
          {t('filter.manage')}
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
      </Flex>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Checkbox.Group size="xs" value={value} onChange={setValue}>
          <Table fz="sm" highlightOnHover sx={{ tableLayout: 'fixed' }}>
            <Table.Thead>
              <Table.Tr>
                <Table.Th style={{ width: '40px' }}></Table.Th>
                <Table.Th style={{ width: '300px' }}>{t('common.label')}</Table.Th>
                <Table.Th>{t('common.key')}</Table.Th>
                <Table.Th style={{ width: '100px' }}>{t('filter.field.widget')}</Table.Th>
                <Table.Th style={{ width: '300px', paddingLeft: '24px' }}>{t('common.action')}</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {model.content.filters.sortedList.map((f) => {
                return (
                  <Table.Tr key={f.id}>
                    <Table.Td>
                      <Checkbox value={f.id} styles={{ input: { cursor: 'pointer' } }} />
                    </Table.Td>
                    <Table.Td>{f.label}</Table.Td>
                    <Table.Td>{f.key}</Table.Td>
                    <Table.Td>{t(filterTypeNames[f.type])}</Table.Td>
                    <Table.Td>
                      <Button variant="subtle" size="xs" onClick={() => navigateToFilter(f.id)}>
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
