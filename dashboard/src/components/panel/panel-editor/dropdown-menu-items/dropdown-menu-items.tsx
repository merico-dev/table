import { Divider, Menu } from '@mantine/core';
import { IconArrowsMaximize, IconCamera, IconCode, IconDownload, IconRefresh } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAdditionalPanelMenuItems } from '~/contexts';
import { DashboardActionContext } from '~/contexts/dashboard-action-context';
import { useEditPanelContext } from '~/contexts/panel-context';
import { EViewComponentType, ViewMetaInstance } from '~/model';
import { DeletePanel } from './delete-panel';
import { Duplicate } from './duplicate';
import { OpenTabInteraction } from './open-tab-interaction';
import { OpenTabPanel } from './open-tab-panel';
import { OpenTabVariable } from './open-tab-variable';
import { OpenTabVisualization } from './open-tab-visualization';
import { QueryMenuItems } from './query-menu-items';
import { Refresh } from '../../panel-render/dropdown-menu-items/refresh';
import { DownloadData } from '../../panel-render/dropdown-menu-items/download-data';
import { DownloadScreenshot } from '../../panel-render/dropdown-menu-items/download-screenshot';
import { DownloadSchema } from '../../panel-render/dropdown-menu-items/download-schema';
import { EnterFullScreen } from '../../panel-render/dropdown-menu-items/enter-fullscreen';

const useItems = (view: ViewMetaInstance) => {
  const items = useMemo(() => {}, []);
  return items;
};

type Props = {
  view: ViewMetaInstance;
};

export const PanelDropdownMenuItems = observer(({ view }: Props) => {
  const { t } = useTranslation();

  const { panel, echartsOptions } = useEditPanelContext();
  const panelID = panel.id;
  const viewID = view.id;

  const { items: additionalItems } = useAdditionalPanelMenuItems();
  return (
    <>
      <Refresh />
      <DownloadData />
      <DownloadSchema />
      <DownloadScreenshot />
      <EnterFullScreen view={view} />

      <QueryMenuItems view={view} />

      <Divider label={t('common.actions.edit')} labelPosition="center" />
      <OpenTabPanel panelID={panelID} viewID={viewID} />
      <OpenTabVariable panelID={panelID} viewID={viewID} />
      <OpenTabVisualization panelID={panelID} viewID={viewID} />
      <OpenTabInteraction panelID={panelID} viewID={viewID} />

      <Divider label={t('common.actions.actions')} labelPosition="center" />
      <Duplicate panelID={panelID} viewID={viewID} />
      <DeletePanel panelID={panelID} viewID={viewID} />
      {additionalItems.map((item) => item.render({ echartsOptions, inEditMode: true, panelID, viewID }))}
    </>
  );
});
