import { observer } from 'mobx-react-lite';

import { Menu } from '@mantine/core';
import { IconArrowsMaximize, IconCamera, IconDownload, IconRefresh } from '@tabler/icons-react';
import React from 'react';

import { useTranslation } from 'react-i18next';
import { useAdditionalPanelMenuItems } from '~/contexts';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { useRenderPanelContext } from '~/contexts/panel-context';
import { EViewComponentType, ViewMetaInstance } from '~/model';

type Props = {
  view: ViewMetaInstance;
};

export const PanelDropdownMenuItems = observer(({ view }: Props) => {
  const { t } = useTranslation();
  const { panel, downloadPanelScreenshot, echartsOptions } = useRenderPanelContext();
  const { items: additionalItems } = useAdditionalPanelMenuItems();

  const { id } = panel;

  const { viewPanelInFullScreen, inFullScreen } = React.useContext(DashboardActionContext);

  const enterFullScreen = React.useCallback(() => {
    viewPanelInFullScreen(id);
  }, [id, viewPanelInFullScreen]);
  const showFullScreenOption = !inFullScreen && view.type !== EViewComponentType.Modal;
  return (
    <>
      <Menu.Item onClick={panel.refreshData} leftSection={<IconRefresh size={14} />}>
        {t('common.actions.refresh')}
      </Menu.Item>
      <Menu.Item onClick={panel.downloadData} leftSection={<IconDownload size={14} />}>
        {t('common.actions.download_data')}
      </Menu.Item>
      <Menu.Item onClick={downloadPanelScreenshot} leftSection={<IconCamera size={14} />}>
        {t('common.actions.download_screenshot')}
      </Menu.Item>
      {showFullScreenOption && (
        <Menu.Item onClick={enterFullScreen} leftSection={<IconArrowsMaximize size={14} />}>
          {t('common.actions.enter_fullscreen')}
        </Menu.Item>
      )}
      {additionalItems.map((item) => item.render({ echartsOptions, inEditMode: false }))}
    </>
  );
});
