import React from 'react';
import { Button, Divider, Group, Menu } from '@mantine/core';
import {
  ClipboardText,
  Code,
  Database,
  DeviceFloppy,
  Download,
  Filter,
  PlaylistAdd,
  Recycle,
  Share,
} from 'tabler-icons-react';
import { DashboardMode } from '../types';
import { ModeToggler } from './toggle-mode';
import { DataEditorModal } from '../definition-editor';
import { LayoutStateContext, useModelContext } from '../contexts';
import { DashboardActionContext } from '../contexts/dashboard-action-context';
import { ViewSchemaModal } from './view-schema-modal';
import { FilterSettingsModal } from '../filter/filter-settings';
import { observer } from 'mobx-react-lite';

interface IDashboardActions {
  mode: DashboardMode;
  setMode: React.Dispatch<React.SetStateAction<DashboardMode>>;
  hasChanges: boolean;
  saveChanges: () => void;
  revertChanges: () => void;
  getCurrentSchema: () => $TSFixMe;
}
export const DashboardActions = observer(function _DashboardActions({
  mode,
  setMode,
  hasChanges,
  saveChanges,
  revertChanges,
  getCurrentSchema,
}: IDashboardActions) {
  const model = useModelContext();
  const { addPanel } = React.useContext(DashboardActionContext);
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
        {!inUseMode && (
          <Button variant="default" size="xs" onClick={addPanel} leftIcon={<PlaylistAdd size={20} />}>
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
