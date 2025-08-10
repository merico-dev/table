import { useMemo } from 'react';
import { useAdditionalPanelMenuItems, useEditPanelContext } from '~/contexts';
import { ViewMetaInstance } from '~/model';
import { PanelMenuItem } from '~/types';
import {
  DownloadData,
  DownloadSchema,
  DownloadScreenshot,
  EnterFullScreen,
  Refresh,
} from '../../panel-render/dropdown-menu-items';
import { useTranslation } from 'react-i18next';
import { Divider } from '@mantine/core';
import { OpenTabPanel } from './open-tab-panel';
import { OpenTabVariable } from './open-tab-variable';
import { OpenTabVisualization } from './open-tab-visualization';
import { OpenTabInteraction } from './open-tab-interaction';
import { DeletePanel } from './delete-panel';
import { Duplicate } from './duplicate';
import { useQueryItems } from './use-query-items';

export const useItems = (view: ViewMetaInstance) => {
  const { t } = useTranslation();
  const { panel } = useEditPanelContext();
  const panelID = panel.id;
  const viewID = view.id;
  const { items: additionalItems } = useAdditionalPanelMenuItems();

  const queryItems = useQueryItems(view);

  return useMemo(() => {
    const ret: PanelMenuItem[] = [
      {
        order: 10,
        render: () => <Refresh key="refresh" />,
      },
      {
        order: 100,
        render: () => <DownloadData key="download-data" />,
      },
      {
        order: 200,
        render: () => <DownloadSchema key="download-schema" />,
      },
      {
        order: 300,
        render: () => <DownloadScreenshot key="download-screenshot" />,
      },
      {
        order: 400,
        render: () => <EnterFullScreen key="enter-full-screen" view={view} />,
      },
      ...queryItems,
      {
        order: 600,
        render: () => <Divider key="edit-divider" label={t('common.actions.edit')} labelPosition="center" />,
      },
      {
        order: 700,
        render: () => <OpenTabPanel key="open-tab-panel" panelID={panelID} viewID={viewID} />,
      },
      {
        order: 800,
        render: () => <OpenTabVariable key="open-tab-variable" panelID={panelID} viewID={viewID} />,
      },
      {
        order: 900,
        render: () => <OpenTabVisualization key="open-tab-visualization" panelID={panelID} viewID={viewID} />,
      },
      {
        order: 1000,
        render: () => <OpenTabInteraction key="open-tab-interaction" panelID={panelID} viewID={viewID} />,
      },
      {
        order: 1100,
        render: () => <Divider key="actions-divider" label={t('common.actions.actions')} labelPosition="center" />,
      },
      {
        order: 1200,
        render: () => <Duplicate key="duplicate" panelID={panelID} viewID={viewID} />,
      },
      {
        order: 1300,
        render: () => <DeletePanel key="delete-panel" panelID={panelID} viewID={viewID} />,
      },

      ...additionalItems,
    ];

    return ret.sort((a, b) => a.order - b.order);
  }, [queryItems, additionalItems]);
};
