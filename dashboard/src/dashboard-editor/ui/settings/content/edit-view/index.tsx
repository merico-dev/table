import { Box, Button, Group, Stack, Text } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext, useEditDashboardContext } from '~/contexts';
import { EditViewForm } from '~/dashboard-editor/ui/settings/content/edit-view/edit-view-form';

export const EditView = observer(({ id }: { id: string }) => {
  const { t } = useTranslation();
  const modals = useModals();
  const model = useEditDashboardContext();
  const content = useEditContentModelContext();
  if (id === '') {
    return null;
  }

  const view = content.views.findByID(id);
  if (!view) {
    return <Text size={'14px'}>View by ID[{id}] is not found</Text>;
  }

  const resetEditorPath = () => {
    model.editor.setPath(['_VIEWS_', '']);
  };
  const removeWithConfirmation = () => {
    modals.openConfirmModal({
      title: `${t('view.delete')}?`,
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => {
        content.views.removeByID(id);
        resetEditorPath();
      },
      confirmProps: { color: 'red' },
      zIndex: 320,
    });
  };
  return (
    <Stack sx={{ maxWidth: '600px', height: '100%' }} gap="sm">
      <Group justify="flex-end" pt={10}>
        <Button size="xs" color="red" leftSection={<IconTrash size={16} />} onClick={removeWithConfirmation}>
          {t('view.delete')}
        </Button>
      </Group>
      <Box sx={{ flexGrow: 1, maxHeight: 'calc(100% - 52px)', overflow: 'auto' }}>
        <EditViewForm view={view} />
      </Box>
    </Stack>
  );
});
