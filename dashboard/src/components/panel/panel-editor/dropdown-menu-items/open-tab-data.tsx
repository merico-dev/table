import { Menu } from '@mantine/core';
import { IconDatabase } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';

export const OpenTabData = observer(({ panelID, viewID }: { panelID: string; viewID: string }) => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const openTabData = () => {
    model.editor.open(['_VIEWS_', viewID, '_PANELS_', panelID, '_TABS_', 'Data']);
  };
  return (
    <Menu.Item onClick={openTabData} leftSection={<IconDatabase size={14} />}>
      {t('data.label')}
    </Menu.Item>
  );
});
