import { Menu } from '@mantine/core';
import { useModals } from '@mantine/modals';
import { IconTrash } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';

export const DeletePanel = observer(({ panelID, viewID }: { panelID: string; viewID: string }) => {
  const { t } = useTranslation();
  const modals = useModals();
  const content = useEditContentModelContext();

  const remove = () =>
    modals.openConfirmModal({
      title: `${t('panel.delete')}?`,
      labels: { confirm: t('common.actions.confirm'), cancel: t('common.actions.cancel') },
      onCancel: () => console.log('Cancel'),
      onConfirm: () => content.removePanelByID(panelID, viewID),
      confirmProps: { color: 'red' },
      zIndex: 320,
    });
  return (
    <Menu.Item color="red" onClick={remove} leftSection={<IconTrash size={14} />}>
      {t('common.actions.delete')}
    </Menu.Item>
  );
});
