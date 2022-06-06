import React from "react";
import { Button, Group } from "@mantine/core";
import { Database, DeviceFloppy, PlaylistAdd, Recycle, Share } from "tabler-icons-react";
import { DashboardMode } from "../types";
import { ModeToggler } from "./toggle-mode";
import { EditDataSourcesModal } from "../definition-editor";

interface IDashboardActions {
  mode: DashboardMode;
  setMode: React.Dispatch<React.SetStateAction<DashboardMode>>;
  hasChanges: boolean;
  addPanel: () => void;
  saveChanges: () => void;
}
export function DashboardActions({
  mode,
  setMode,
  hasChanges,
  addPanel,
  saveChanges,
}: IDashboardActions) {
  const [dataSourcesOpened, setDataSourcesOpened] = React.useState(false);
  const openDataSources = () => setDataSourcesOpened(true);
  const closeDataSources = () => setDataSourcesOpened(false);

  const inEditMode = mode === DashboardMode.Edit;
  return (
    <Group position="apart" pt="sm" pb="xs">
      <Group position="left">
        <ModeToggler mode={mode} setMode={setMode} />
      </Group>
      {inEditMode && (
        <Group position="right">
          <Button variant="default" size="sm" onClick={addPanel} leftIcon={<PlaylistAdd size={20} />}>Add a Panel</Button>
          <Button variant="default" size="sm" onClick={openDataSources} leftIcon={<Database size={20} />}>Data Sources</Button>
          <Button variant="default" size="sm" onClick={saveChanges} disabled={!hasChanges} leftIcon={<DeviceFloppy size={20} />}>Save Changes</Button>
          <Button color="red" size="sm" disabled={!hasChanges} leftIcon={<Recycle size={20} />}>Revert Changes</Button>
        </Group>
      )}
      {inEditMode && (
        <EditDataSourcesModal opened={dataSourcesOpened} close={closeDataSources} />
      )}
      {!inEditMode && (
        <Button variant="default" size="sm" disabled leftIcon={<Share size={20} />}>Share</Button>
      )}
    </Group>
  )
}