import { Box, Button, Group, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { observer } from 'mobx-react-lite';
import { Trash } from 'tabler-icons-react';
import { useModelContext } from '~/contexts';
import { FilterSetting } from '~/filter/filter-settings/filter-setting';

export const EditFilter = observer(({ id }: { id: string }) => {
  const modals = useModals();
  const model = useModelContext();
  if (id === '') {
    return null;
  }
  const filter = model.filters.findByID(id);
  if (!filter) {
    return <Text size={14}>Filter by ID[{id}] is not found</Text>;
  }

  const removeWithConfirmation = () => {
    modals.openConfirmModal({
      title: 'Delete this filter?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => model.filters.removeByID(id),
      zIndex: 320,
    });
  };
  return (
    <Stack sx={{ maxWidth: '1100px', height: '100%' }} spacing="sm">
      <Group position="right" pt={10}>
        <Button size="xs" color="red" leftIcon={<Trash size={16} />} onClick={removeWithConfirmation}>
          Delete this filter
        </Button>
      </Group>
      <Box sx={{ flexGrow: 1, maxHeight: 'calc(100% - 52px)', overflow: 'auto' }}>
        <FilterSetting filter={filter} />
      </Box>
    </Stack>
  );
});
