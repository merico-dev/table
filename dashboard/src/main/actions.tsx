import { ActionIcon, Button, Group, Menu, Tooltip } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Code, Database, DeviceFloppy, Download, Filter, PlaylistAdd, Recycle, Share } from 'tabler-icons-react';
import { LayoutStateContext, useModelContext } from '../contexts';
import { DataEditorModal } from '../definition-editor';
import { FilterSettingsModal } from '../filter/filter-settings';
import { SwitchViews } from './switch-views';
import { ViewSchemaModal } from './view-schema-modal';

interface IDashboardActions {
  saveChanges: () => void;
}
export const DashboardActions = observer(function _DashboardActions({ saveChanges }: IDashboardActions) {
  const model = useModelContext();

  const getCurrentSchema = React.useCallback(() => {
    const queries = model.queries.current;
    const views = model.views.current;
    const sqlSnippets = model.sqlSnippets.current;
    const filters = model.filters.current;
    return {
      filters,
      views,
      definition: {
        sqlSnippets,
        queries,
      },
    };
  }, [model]);

  const revertChanges = () => {
    model.filters.reset();
    model.views.reset();
    model.sqlSnippets.reset();
    model.queries.reset();
  };

  const hasChanges = model.views.changed || model.sqlSnippets.changed || model.queries.changed || model.filters.changed;
  const { inEditMode, inUseMode } = React.useContext(LayoutStateContext);

  const [dataEditorOpened, setDataEditorOpened] = React.useState(false);
  const openQueries = () => setDataEditorOpened(true);
  const closeQueries = () => setDataEditorOpened(false);

  const [filtersOpened, setFiltersOpened] = React.useState(false);
  const openFilters = () => setFiltersOpened(true);
  const closeFilters = () => setFiltersOpened(false);

  const [schemaOpened, setSchemaOpened] = React.useState(false);
  const openSchema = () => setSchemaOpened(true);
  const closeSchema = () => setSchemaOpened(false);

  return (
    <Group position="apart" pt={0} px={10} pb="xs">
      <Group position="left">{inEditMode && <SwitchViews />}</Group>
      <Group position="right">
        {inEditMode && (
          <>
            <Button
              variant="filled"
              size="xs"
              disabled={!model.views.VIE}
              onClick={model.views.addAPanelToVIE}
              leftIcon={<PlaylistAdd size={20} />}
            >
              Add a Panel
            </Button>
            <Group spacing={0}>
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
            </Group>
            <Group spacing={0}>
              <Tooltip label="Save Changes">
                <ActionIcon variant="outline" color="green" size="md" onClick={saveChanges} disabled={!hasChanges}>
                  <DeviceFloppy size={20} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Revert Changes">
                <ActionIcon variant="outline" color="red" size="md" disabled={!hasChanges} onClick={revertChanges}>
                  <Recycle size={20} />
                </ActionIcon>
              </Tooltip>
            </Group>
          </>
        )}
        {!inUseMode && (
          <Menu width={180}>
            <Menu.Target>
              <Tooltip label="Export">
                <ActionIcon variant="default" size="md">
                  <Share size={20} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item icon={<Download size={14} />} onClick={model.queries.downloadAllData}>
                Download Data
              </Menu.Item>
              <Menu.Item icon={<Code size={14} />} onClick={openSchema}>
                View Schema
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
      <FilterSettingsModal opened={filtersOpened} close={closeFilters} />
      <DataEditorModal opened={dataEditorOpened} close={closeQueries} />
      <ViewSchemaModal opened={schemaOpened} close={closeSchema} getCurrentSchema={getCurrentSchema} />
    </Group>
  );
});
