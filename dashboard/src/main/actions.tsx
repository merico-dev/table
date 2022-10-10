import { Button, Group, Menu } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Code, Database, DeviceFloppy, Download, Filter, PlaylistAdd, Recycle, Share } from 'tabler-icons-react';
import { LayoutStateContext, useModelContext } from '../contexts';
import { DataEditorModal } from '../definition-editor';
import { FilterSettingsModal } from '../filter/filter-settings';
import { DashboardMode } from '../types';
import { ModeToggler } from './toggle-mode';
import { ViewSchemaModal } from './view-schema-modal';

interface IDashboardActions {
  mode: DashboardMode;
  setMode: React.Dispatch<React.SetStateAction<DashboardMode>>;
  saveChanges: () => void;
  getCurrentSchema: () => $TSFixMe;
}
export const DashboardActions = observer(function _DashboardActions({
  mode,
  setMode,
  saveChanges,
  getCurrentSchema,
}: IDashboardActions) {
  const model = useModelContext();

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
    <Group position="apart" pt={0} pb="xs">
      <Group position="left">
        <ModeToggler mode={mode} setMode={setMode} />
      </Group>
      <Group position="right">
        {/* {!inUseMode && (
          <Button variant="default" size="xs" onClick={model.panels.addANewPanel} leftIcon={<PlaylistAdd size={20} />}>
            Add a Panel
          </Button>
        )} */}
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
      </Group>
      <FilterSettingsModal opened={filtersOpened} close={closeFilters} />
      <DataEditorModal opened={dataEditorOpened} close={closeQueries} />
      <ViewSchemaModal opened={schemaOpened} close={closeSchema} getCurrentSchema={getCurrentSchema} />
    </Group>
  );
});
