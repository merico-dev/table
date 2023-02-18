import { ActionIcon, Button, Group, Menu, Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Code, Database, Download, Filter, Link, PlaylistAdd, Share } from 'tabler-icons-react';
import { InteractionsViewerModal } from '~/interactions/interactions-viewer';
import { ActionIconGroupStyle } from '~/styles/action-icon-group-style';
import { downloadJSON } from '~/utils/download';
import { useModelContext } from '../contexts';
import { DataEditorModal } from '../definition-editor';
import { FilterSettingsModal } from '../filter/filter-settings';
import { SwitchViews } from '../main/dashboard-editor/switch-views';

interface IDashboardActions {
  inUseMode: boolean;
}

export const DashboardActions = observer(function _DashboardActions({ inUseMode }: IDashboardActions) {
  const model = useModelContext();

  const getCurrentSchema = React.useCallback(() => {
    const queries = model.queries.json;
    const views = model.views.json;
    const sqlSnippets = model.sqlSnippets.json;
    const filters = model.filters.current;
    const mock_context = model.mock_context.current;
    return {
      filters,
      views,
      definition: {
        sqlSnippets,
        queries,
        mock_context,
      },
      version: model.version,
    };
  }, [model]);

  const [dataEditorOpened, setDataEditorOpened] = React.useState(false);
  const openQueries = () => setDataEditorOpened(true);
  const closeQueries = () => setDataEditorOpened(false);

  const [filtersOpened, setFiltersOpened] = React.useState(false);
  const openFilters = () => setFiltersOpened(true);
  const closeFilters = () => setFiltersOpened(false);

  const [interactionsOpened, setInteractionsOpened] = React.useState(false);
  const openInteractions = () => setInteractionsOpened(true);
  const closeInteractions = () => setInteractionsOpened(false);

  const downloadSchema = () => {
    const schema = JSON.stringify(getCurrentSchema(), null, 2);
    downloadJSON(model.name, schema);
  };

  if (inUseMode) {
    return null;
  }

  return (
    <Group position="apart" pt={0} px={10} pb="xs">
      <Group position="left">
        <SwitchViews />
      </Group>
      <Group position="right" sx={{ button: { minWidth: '40px' } }}>
        <Button
          variant="filled"
          size="xs"
          disabled={!model.views.VIE}
          onClick={model.views.addAPanelToVIE}
          leftIcon={<PlaylistAdd size={20} />}
        >
          Add a Panel
        </Button>
        <Group spacing={0} sx={ActionIconGroupStyle}>
          <Tooltip label="Filters">
            <ActionIcon variant="default" size="md" onClick={openFilters}>
              <Filter size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Data Settings">
            <ActionIcon variant="default" size="md" onClick={openQueries}>
              <Database size={20} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Interactions Viewer">
            <ActionIcon variant="default" size="md" onClick={openInteractions}>
              <Link size={20} />
            </ActionIcon>
          </Tooltip>
        </Group>

        <Menu width={180} trigger="hover">
          <Menu.Target>
            <ActionIcon variant="default" size="md">
              <Share size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item icon={<Download size={14} />} onClick={model.queries.downloadAllData}>
              Download Data
            </Menu.Item>
            <Menu.Item icon={<Code size={14} />} onClick={downloadSchema}>
              Download Schema
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
      <FilterSettingsModal opened={filtersOpened} close={closeFilters} />
      <DataEditorModal opened={dataEditorOpened} close={closeQueries} />
      <InteractionsViewerModal opened={interactionsOpened} close={closeInteractions} />
    </Group>
  );
});
