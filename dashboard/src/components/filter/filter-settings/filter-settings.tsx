import { Box, Button, Group, Stack, Tabs } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { useModals } from '@mantine/modals';
import { observer } from 'mobx-react-lite';

import { IconPlaylistAdd, IconRecycle, IconTrash } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';
import { DashboardFilterType, FilterMetaInstance, createFilterTextInputConfig } from '~/model';
import { FilterSetting } from './filter-setting';
import './filter-settings.css';

export const FilterSettings = observer(function _FilterSettings() {
  const { t } = useTranslation();
  const model = useEditContentModelContext();
  const filters = model.filters.current;

  const addFilter = () => {
    const id = randomId();
    const filter = {
      id,
      key: id,
      label: id,
      order: filters.length + 1,
      type: DashboardFilterType.TextInput,
      config: createFilterTextInputConfig(),
      visibleInViewsIDs: ['Main'],
      auto_submit: false,
    } as FilterMetaInstance;
    model.filters.append(filter);
  };

  const modals = useModals();
  const removeWithConfirmation = (id: string) => {
    modals.openConfirmModal({
      title: `${t('filter.delete')}?`,
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => model.filters.removeByID(id),
      zIndex: 320,
    });
  };

  return (
    <Box sx={{ height: '90vh', maxHeight: 'calc(100vh - 185px)' }} p={0}>
      <Group sx={{ position: 'absolute', top: '16px', right: '16px' }}>
        <Button
          size="xs"
          color="red"
          leftIcon={<IconRecycle size={20} />}
          disabled={!model.filtersChanged}
          onClick={model.resetFilters}
        >
          Revert Changes
        </Button>
      </Group>
      <Tabs
        className="filter-settings-tabs"
        orientation="vertical"
        defaultValue={model.filters.firstID}
        styles={{
          root: {
            display: 'block',
          },
        }}
        keepMounted={false}
      >
        <Group sx={{ height: '100%' }}>
          <Stack sx={{ height: '100%' }}>
            <Button size="xs" color="blue" leftIcon={<IconPlaylistAdd size={20} />} onClick={addFilter}>
              {t('filter.add')}
            </Button>
            <Tabs.List position="left" sx={{ flexGrow: 1, width: '200px' }}>
              {model.filters.current.map((field) => (
                <Tabs.Tab key={field.id} value={field.id} sx={{ maxWidth: '100%', overflow: 'auto' }}>
                  {field.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Stack>
          <Box sx={{ flexGrow: 1, height: '100%' }}>
            {model.filters.current.map((filter) => (
              <Tabs.Panel key={filter.id} value={filter.id} sx={{ height: '100%' }}>
                <Stack sx={{ height: '100%' }} gap="sm">
                  <Box sx={{ flexGrow: 1, maxHeight: 'calc(100% - 52px)', overflow: 'auto' }}>
                    <FilterSetting filter={filter} />
                  </Box>
                  <Group justify="flex-end" pt={10}>
                    <Button
                      size="xs"
                      color="red"
                      leftIcon={<IconTrash size={20} />}
                      onClick={() => removeWithConfirmation(filter.id)}
                    >
                      {t('filter.delete')}
                    </Button>
                  </Group>
                </Stack>
              </Tabs.Panel>
            ))}
          </Box>
        </Group>
      </Tabs>
    </Box>
  );
});
