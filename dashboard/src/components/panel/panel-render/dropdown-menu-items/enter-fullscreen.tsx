import { Menu } from '@mantine/core';
import { IconArrowsMaximize, IconCode } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useCallback, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useRenderPanelContext } from '~/contexts';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { EViewComponentType, ViewMetaInstance } from '~/model';

export const EnterFullScreen = observer(({ view }: { view: ViewMetaInstance }) => {
  const { t } = useTranslation();
  const { panel } = useRenderPanelContext();
  const panelID = panel.id;

  const { viewPanelInFullScreen, inFullScreen } = useContext(DashboardActionContext);

  const enterFullScreen = useCallback(() => {
    viewPanelInFullScreen(panelID);
  }, [panelID, viewPanelInFullScreen]);
  const showFullScreenOption = !inFullScreen && view.type !== EViewComponentType.Modal;
  if (!showFullScreenOption) {
    return null;
  }

  return (
    <Menu.Item onClick={enterFullScreen} leftSection={<IconArrowsMaximize size={14} />}>
      {t('common.actions.enter_fullscreen')}
    </Menu.Item>
  );
});
