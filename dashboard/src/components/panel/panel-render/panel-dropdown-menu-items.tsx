import { observer } from 'mobx-react-lite';

import { Menu } from '@mantine/core';
import { IconArrowsMaximize, IconCamera, IconDownload, IconRefresh } from '@tabler/icons-react';
import React, { useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';
import { useAdditionalPanelMenuItems } from '~/contexts';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { useRenderPanelContext } from '~/contexts/panel-context';
import { EViewComponentType, ViewMetaInstance } from '~/model';
import { PanelMenuItem } from '~/types';

const useItems = (view: ViewMetaInstance) => {
  const { t } = useTranslation();
  const { panel, downloadPanelScreenshot } = useRenderPanelContext();
  const { items: additionalItems } = useAdditionalPanelMenuItems();

  const { viewPanelInFullScreen, inFullScreen } = React.useContext(DashboardActionContext);

  const { id } = panel;
  const enterFullScreen = useCallback(() => {
    viewPanelInFullScreen(id);
  }, [id, viewPanelInFullScreen]);
  const showFullScreenOption = !inFullScreen && view.type !== EViewComponentType.Modal;

  return useMemo(() => {
    const ret: PanelMenuItem[] = [
      {
        order: 10,
        render: () => (
          <Menu.Item onClick={panel.refreshData} leftSection={<IconRefresh size={14} />}>
            {t('common.actions.refresh')}
          </Menu.Item>
        ),
      },
      {
        order: 20,
        render: () => (
          <Menu.Item onClick={panel.downloadData} leftSection={<IconDownload size={14} />}>
            {t('common.actions.download_data')}
          </Menu.Item>
        ),
      },
      {
        order: 30,
        render: () => (
          <Menu.Item onClick={downloadPanelScreenshot} leftSection={<IconCamera size={14} />}>
            {t('common.actions.download_screenshot')}
          </Menu.Item>
        ),
      },
      {
        order: 40,
        render: () => (
          <Menu.Item onClick={downloadPanelScreenshot} leftSection={<IconCamera size={14} />}>
            {t('common.actions.download_screenshot')}
          </Menu.Item>
        ),
      },
      ...additionalItems,
    ];
    if (showFullScreenOption) {
      ret.push({
        order: 50,
        render: () => (
          <Menu.Item onClick={enterFullScreen} leftSection={<IconArrowsMaximize size={14} />}>
            {t('common.actions.enter_fullscreen')}
          </Menu.Item>
        ),
      });
    }

    return ret.sort((a, b) => a.order - b.order);
  }, [additionalItems, showFullScreenOption]);
};

type Props = {
  view: ViewMetaInstance;
};

export const PanelDropdownMenuItems = observer(({ view }: Props) => {
  const { echartsOptions, panel } = useRenderPanelContext();
  const items = useItems(view);
  return items.map((item) => item.render({ echartsOptions, inEditMode: false, panelID: panel.id, viewID: view.id }));
});
