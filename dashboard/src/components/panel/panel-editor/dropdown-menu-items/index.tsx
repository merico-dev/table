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

const useItems = (view: ViewMetaInstance) => {
  const items = useMemo(() => {}, []);
  return items;
};

type Props = {
  view: ViewMetaInstance;
};

export const PanelDropdownMenuItems = observer(({ view }: Props) => {
  const { t } = useTranslation();

  const { panel, downloadPanelScreenshot, echartsOptions } = useEditPanelContext();
  const panelID = panel.id;
  const viewID = view.id;

  const { viewPanelInFullScreen, inFullScreen } = React.useContext(DashboardActionContext);

  const enterFullScreen = React.useCallback(() => {
    viewPanelInFullScreen(panelID);
  }, [panelID, viewPanelInFullScreen]);
  const showFullScreenOption = !inFullScreen && view.type !== EViewComponentType.Modal;

  const { items: additionalItems } = useAdditionalPanelMenuItems();
  return (
    <>
      <Menu.Item onClick={panel.refreshData} leftSection={<IconRefresh size={14} />}>
        {t('common.actions.refresh')}
      </Menu.Item>
      <Menu.Item onClick={panel.downloadData} leftSection={<IconDownload size={14} />}>
        {t('common.actions.download_data')}
      </Menu.Item>
      <Menu.Item onClick={panel.downloadSchema} leftSection={<IconCode size={14} />}>
        {t('common.actions.download_schema')}
      </Menu.Item>
      <Menu.Item onClick={downloadPanelScreenshot} leftSection={<IconCamera size={14} />}>
        {t('common.actions.download_screenshot')}
      </Menu.Item>
      {showFullScreenOption && (
        <Menu.Item onClick={enterFullScreen} leftSection={<IconArrowsMaximize size={14} />} disabled>
          {t('common.actions.enter_fullscreen')}
        </Menu.Item>
      )}

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
