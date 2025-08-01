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
import { Refresh } from './refresh';
import { DownloadData } from './download-data';
import { DownloadScreenshot } from './download-screenshot';
import { EnterFullScreen } from './enter-fullscreen';

const useItems = (view: ViewMetaInstance) => {
  const { items: additionalItems } = useAdditionalPanelMenuItems();

  return useMemo(() => {
    const ret: PanelMenuItem[] = [
      {
        order: 10,
        render: Refresh,
      },
      {
        order: 20,
        render: DownloadData,
      },
      {
        order: 30,
        render: DownloadScreenshot,
      },
      {
        order: 50,
        render: () => <EnterFullScreen view={view} />,
      },
      ...additionalItems,
    ];

    return ret.sort((a, b) => a.order - b.order);
  }, [additionalItems]);
};

type Props = {
  view: ViewMetaInstance;
};

export const PanelDropdownMenuItems = observer(({ view }: Props) => {
  const { echartsOptions, panel } = useRenderPanelContext();
  const items = useItems(view);
  return items.map((item) => item.render({ echartsOptions, inEditMode: false, panelID: panel.id, viewID: view.id }));
});
