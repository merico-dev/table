import { Menu } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditContentModelContext } from '~/contexts';
import { IconCopy } from '@tabler/icons-react';

export const Duplicate = observer(({ panelID, viewID }: { panelID: string; viewID: string }) => {
  const { t } = useTranslation();
  const content = useEditContentModelContext();
  const duplicate = () => {
    content.duplicatePanelByID(panelID, viewID);
  };
  return (
    <Menu.Item onClick={duplicate} leftSection={<IconCopy size={14} />}>
      {t('common.actions.duplicate')}
    </Menu.Item>
  );
});
