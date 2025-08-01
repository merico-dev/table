import { Menu } from '@mantine/core';
import { IconVariable } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';

export const OpenTabVariable = observer(({ panelID, viewID }: { panelID: string; viewID: string }) => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const openTabVar = () => {
    model.editor.open(['_VIEWS_', viewID, '_PANELS_', panelID, '_TABS_', 'Variables']);
  };
  return (
    <Menu.Item onClick={openTabVar} leftSection={<IconVariable size={14} />}>
      {t('panel.variable.labels')}
    </Menu.Item>
  );
});
