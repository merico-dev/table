import React from "react";
import { Button, Group } from "@mantine/core";
import { ClipboardText, Database, DeviceFloppy, PlaylistAdd, Recycle, Share } from "tabler-icons-react";
import { DashboardMode } from "../types";
import { ModeToggler } from "./toggle-mode";
import { EditDataSourcesModal, EditSQLSnippetsModal } from "../definition-editor";
import { LayoutStateContext } from "../contexts";

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
  const { inLayoutMode, inEditMode, inUseMode } = React.useContext(LayoutStateContext);

  const [dataSourcesOpened, setDataSourcesOpened] = React.useState(false);
  const openDataSources = () => setDataSourcesOpened(true);
  const closeDataSources = () => setDataSourcesOpened(false);

  const [sqlSnippetsOpened, setSQLSnippetsOpened] = React.useState(false);
  const openSQLSnippets = () => setSQLSnippetsOpened(true);
  const closeSQLSnippets = () => setSQLSnippetsOpened(false);
  return (
    <Group position="apart" pt="sm" pb="xs">
      <Group position="left">
        <ModeToggler mode={mode} setMode={setMode} />
      </Group>
      <Group position="right">
        {!inUseMode && <Button variant="default" size="sm" onClick={addPanel} leftIcon={<PlaylistAdd size={20} />}>Add a Panel</Button>}
        {inEditMode && <Button variant="default" size="sm" onClick={openSQLSnippets} leftIcon={<ClipboardText size={20} />}>SQL Snippets</Button>}
        {inEditMode && <Button variant="default" size="sm" onClick={openDataSources} leftIcon={<Database size={20} />}>Data Sources</Button>}
        {!inUseMode && <Button variant="default" size="sm" onClick={saveChanges} disabled={!hasChanges} leftIcon={<DeviceFloppy size={20} />}>Save Changes</Button>}
        {!inUseMode && <Button color="red" size="sm" disabled={!hasChanges} leftIcon={<Recycle size={20} />}>Revert Changes</Button>}
      </Group>
      <EditDataSourcesModal opened={dataSourcesOpened} close={closeDataSources} />
      <EditSQLSnippetsModal opened={sqlSnippetsOpened} close={closeSQLSnippets} />
      {inUseMode && <Button variant="default" size="sm" disabled leftIcon={<Share size={20} />}>Share</Button>}
    </Group>
  )
}