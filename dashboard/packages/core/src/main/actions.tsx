import React from "react";
import { Button, Group } from "@mantine/core";
import { ClipboardText, Database, DeviceFloppy, PlaylistAdd, Recycle, Share } from "tabler-icons-react";
import { DashboardMode } from "../types";
import { ModeToggler } from "./toggle-mode";
import { DataEditorModal } from "../definition-editor";
import { LayoutStateContext } from "../contexts";
import { DashboardActionContext } from "../contexts/dashboard-action-context";

interface IDashboardActions {
  mode: DashboardMode;
  setMode: React.Dispatch<React.SetStateAction<DashboardMode>>;
  hasChanges: boolean;
  saveChanges: () => void;
  revertChanges: () => void;
}
export function DashboardActions({
  mode,
  setMode,
  hasChanges,
  saveChanges,
  revertChanges,
}: IDashboardActions) {
  const { addPanel } = React.useContext(DashboardActionContext);
  const { inLayoutMode, inEditMode, inUseMode } = React.useContext(LayoutStateContext);

  const [dataEditorOpened, setDataEditorOpened] = React.useState(false);
  const openQueries = () => setDataEditorOpened(true);
  const closeQueries = () => setDataEditorOpened(false);

  return (
    <Group position="apart" pt="sm" pb="xs">
      <Group position="left">
        <ModeToggler mode={mode} setMode={setMode} />
      </Group>
      <Group position="right">
        {!inUseMode && <Button variant="default" size="sm" onClick={addPanel} leftIcon={<PlaylistAdd size={20} />}>Add a Panel</Button>}
        {inEditMode && <Button variant="default" size="sm" onClick={openQueries} leftIcon={<Database size={20} />}>Data Settings</Button>}
        {!inUseMode && <Button variant="default" size="sm" onClick={saveChanges} disabled={!hasChanges} leftIcon={<DeviceFloppy size={20} />}>Save Changes</Button>}
        {!inUseMode && <Button color="red" size="sm" disabled={!hasChanges} onClick={revertChanges} leftIcon={<Recycle size={20} />}>Revert Changes</Button>}
      </Group>
      <DataEditorModal opened={dataEditorOpened} close={closeQueries} />
      {inUseMode && <Button variant="default" size="sm" disabled leftIcon={<Share size={20} />}>Share</Button>}
    </Group>
  )
}