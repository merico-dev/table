import { Box, Button, Group, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import { FilterSetting } from '~/components/filter/filter-settings/filter-setting';
import { useEditContentModelContext, useEditDashboardContext } from '~/contexts';
import { FilterModelInstance } from '~/dashboard-editor';

export const EditFilter = observer(({ id }: { id: string }) => {
  const { t } = useTranslation();
  const modals = useModals();
  const model = useEditDashboardContext();
  const content = useEditContentModelContext();
  if (id === '') {
    return null;
  }

  const filter = content.filters.findByID(id);
  if (!filter) {
    return <Text size={'14px'}>Filter by ID[{id}] is not found</Text>;
  }

  const resetEditorPath = () => {
    model.editor.setPath(['_FILTERS_', '']);
  };

  const removeWithConfirmation = () => {
    modals.openConfirmModal({
      title: `${t('filter.delete')}?`,
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        content.filters.removeByID(id);
        resetEditorPath();
      },
      confirmProps: { color: 'red' },
      zIndex: 320,
    });
  };
  return (
    <Stack sx={{ minWidth: '1100px', height: '100vh' }} gap="sm" pb={30}>
      <Group justify="flex-end" pt={10}>
        <Button size="xs" color="red" leftSection={<IconTrash size={16} />} onClick={removeWithConfirmation}>
          {t('filter.delete')}
        </Button>
      </Group>
      <Box sx={{ flexGrow: 1, maxHeight: 'calc(100% - 52px)', overflow: 'auto' }}>
        <FilterSetting filter={filter as FilterModelInstance} />
      </Box>
    </Stack>
  );
});
