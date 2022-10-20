import { Button, Group, Menu } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Code, Database, DeviceFloppy, Download, Filter, PlaylistAdd, Recycle, Share } from 'tabler-icons-react';
import { ViewModelInstance } from '..';
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
        {!inUseMode && (
          <Button
            variant="default"
            size="xs"
            disabled={!model.views.VIE}
            onClick={model.views.addAPanelToVIE}
            leftIcon={<PlaylistAdd size={20} />}
          >
            Add a Panel
          </Button>
        )}
        {inEditMode && (
          <Button variant="default" size="xs" onClick={openFilters} leftIcon={<Filter size={20} />}>
            Filters
          </Button>
        )}
        {inEditMode && (
          <Button variant="default" size="xs" onClick={openQueries} leftIcon={<Database size={20} />}>
            Data Settings
          </Button>
        )}
        {!inUseMode && (
          <Button
            variant="default"
            size="xs"
            onClick={saveChanges}
            disabled={!hasChanges}
            leftIcon={<DeviceFloppy size={20} />}
          >
            Save Changes
          </Button>
        )}
        {!inUseMode && (
          <Button color="red" size="xs" disabled={!hasChanges} onClick={revertChanges} leftIcon={<Recycle size={20} />}>
            Revert Changes
          </Button>
        )}
        {!inUseMode && (
          <Menu width={180}>
            <Menu.Target>
              <Button variant="default" size="xs" leftIcon={<Share size={20} />}>
                Export
              </Button>
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
