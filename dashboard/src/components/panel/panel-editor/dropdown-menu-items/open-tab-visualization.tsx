import { Menu } from '@mantine/core';
import { IconChartHistogram } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';

export const OpenTabVisualization = observer(({ panelID, viewID }: { panelID: string; viewID: string }) => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const openTabViz = () => {
    model.editor.open(['_VIEWS_', viewID, '_PANELS_', panelID, '_TABS_', 'Visualization']);
  };
  return (
    <Menu.Item onClick={openTabViz} leftSection={<IconChartHistogram size={14} />}>
      {t('visualization.label')}
    </Menu.Item>
  );
});
