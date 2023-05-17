import { Box, Button, Group, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { observer } from 'mobx-react-lite';
import { Trash } from 'tabler-icons-react';
import { useContentModelContext, useModelContext } from '~/contexts';
import { EditViewForm } from '~/main/dashboard-editor/settings/content/edit-view/edit-view-form';

export const EditView = observer(({ id }: { id: string }) => {
  const modals = useModals();
  const model = useModelContext();
  const content = useContentModelContext();
  if (id === '') {
    return null;
  }

  const view = content.views.findByID(id);
  if (!view) {
    return <Text size={14}>View by ID[{id}] is not found</Text>;
  }

  const resetEditorPath = () => {
    model.editor.setPath(['_VIEWS_', '']);
  };
  const removeWithConfirmation = () => {
    modals.openConfirmModal({
      title: 'Delete this view?',
      labels: { confirm: 'Confirm', cancel: 'Cancel' },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        content.views.removeByID(id);
        resetEditorPath();
      },
      zIndex: 320,
    });
  };
  return (
    <Stack sx={{ maxWidth: '600px', height: '100%' }} spacing="sm">
      <Group position="right" pt={10}>
        <Button size="xs" color="red" leftIcon={<Trash size={16} />} onClick={removeWithConfirmation}>
          Delete this view
        </Button>
      </Group>
      <Box sx={{ flexGrow: 1, maxHeight: 'calc(100% - 52px)', overflow: 'auto' }}>
        <EditViewForm view={view} />
      </Box>
    </Stack>
  );
});
