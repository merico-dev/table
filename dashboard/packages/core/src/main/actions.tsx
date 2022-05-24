import React from "react";
import { Button, Group } from "@mantine/core";
import { DeviceFloppy, PlaylistAdd, Recycle, Share } from "tabler-icons-react";
import { DashboardMode } from "../types";
import { ModeToggler } from "./toggle-mode";

interface IDashboardActions {
  mode: DashboardMode;
  setMode: React.Dispatch<React.SetStateAction<DashboardMode>>;
  addPanel: () => void;
}
export function DashboardActions({
  mode,
  setMode,
  addPanel,
}: IDashboardActions) {
  const inEditMode = mode === DashboardMode.Edit;
  return (
    <Group position="apart" pt="sm" pb="xs">
      <Group position="left">
        <ModeToggler mode={mode} setMode={setMode} />
      </Group>
      {inEditMode && (
        <Group position="right">
          <Button variant="default" size="sm" onClick={addPanel} leftIcon={<PlaylistAdd size={20} />}>Add a Panel</Button>
          <Button variant="default" size="sm" disabled leftIcon={<DeviceFloppy size={20} />}>Save Dashboard</Button>
          <Button color="red" size="sm" disabled leftIcon={<Recycle size={20} />}>Revert Changes</Button>
        </Group>
      )}
      {!inEditMode && (
        <Button variant="default" size="sm" disabled leftIcon={<Share size={20} />}>Share</Button>
      )}
    </Group>
  )
}