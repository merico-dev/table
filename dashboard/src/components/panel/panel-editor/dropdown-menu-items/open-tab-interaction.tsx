import { Menu } from '@mantine/core';
import { IconRoute } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';

export const OpenTabInteraction = observer(({ panelID, viewID }: { panelID: string; viewID: string }) => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const openTabInteraction = () => {
    model.editor.open(['_VIEWS_', viewID, '_PANELS_', panelID, '_TABS_', 'Interactions']);
  };
  return (
    <Menu.Item onClick={openTabInteraction} leftSection={<IconRoute size={14} />}>
      {t('interactions.label')}
    </Menu.Item>
  );
});
