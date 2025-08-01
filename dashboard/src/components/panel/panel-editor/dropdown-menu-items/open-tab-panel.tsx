import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';
import { useTranslation } from 'react-i18next';
import { Menu } from '@mantine/core';
import { IconAppWindow } from '@tabler/icons-react';

export const OpenTabPanel = observer(({ panelID, viewID }: { panelID: string; viewID: string }) => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const openTabPanel = () => {
    model.editor.open(['_VIEWS_', viewID, '_PANELS_', panelID, '_TABS_', 'Panel']);
  };
  return (
    <Menu.Item onClick={openTabPanel} leftSection={<IconAppWindow size={14} />}>
      {t('panel.label')}
    </Menu.Item>
  );
});
