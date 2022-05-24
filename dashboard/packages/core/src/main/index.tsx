import React from "react";
import _ from "lodash";
import { DashboardMode, IDashboard, IDashboardPanel } from "../types/dashboard";
import { Button, Group } from "@mantine/core";
import { DeviceFloppy, PlaylistAdd, Recycle, Share } from "tabler-icons-react";
import { LayoutStateContext } from "../contexts/layout-state-context";
import { ModeToggler } from "./toggle-mode";
import { DashboardLayout } from "../layout";

interface IDashboardLayout {
  dashboard: IDashboard;
  className?: string;
}

export function Dashboard({
  dashboard,
  className = "dashboard",
}: IDashboardLayout) {
  const [layoutFrozen, freezeLayout] = React.useState(false);
  const [newCounter, setNewCounter] = React.useState(0)
  const [breakpoint, setBreakpoint] = React.useState()
  const [localCols, setLocalCols] = React.useState()
  const [items, setItems] = React.useState<IDashboardPanel[]>(dashboard.panels)
  const [mode, setMode] = React.useState<DashboardMode>(DashboardMode.Edit)

  const onAddItem = () => {
    /*eslint no-console: 0*/
    console.log("adding", "n" + newCounter);
    setNewCounter(v => v + 1)
    const id = "n" + newCounter;
    const newItem = {
      id,
      layout: {
        x: (items.length * 2) % (localCols || 12),
        y: Infinity, // puts it at the bottom
        w: 4,
        h: 4,
      },
      title: `New Panel - ${id}`,
      description: "description goes here",
      sql: '',
      viz: {
        type: 'table',
        conf: {},
      }
    };
    setItems(items => ([...items, newItem]));
  }

  const removePanelByID = (id: string) => {
    setItems(items => _.reject(items, { id }));
  }

  const inEditMode = mode === DashboardMode.Edit;
  return (
    <div className={className}>
      <LayoutStateContext.Provider value={{ layoutFrozen, freezeLayout, mode, inEditMode }}>
        <Group position="apart" pt="sm" pb="xs">
          <Group position="left">
            <ModeToggler mode={mode} setMode={setMode} />
          </Group>
          {inEditMode && (
            <Group position="right">
              <Button variant="default" size="sm" onClick={onAddItem} leftIcon={<PlaylistAdd size={20} />}>Add a Panel</Button>
              <Button variant="default" size="sm" disabled leftIcon={<DeviceFloppy size={20} />}>Save Dashboard</Button>
              <Button color="red" size="sm" disabled leftIcon={<Recycle size={20} />}>Revert Changes</Button>
            </Group>
          )}
          {!inEditMode && (
            <Button variant="default" size="sm" disabled leftIcon={<Share size={20} />}>Share</Button>
          )}
        </Group>
        <DashboardLayout
          panels={dashboard.panels}
          isDraggable={inEditMode && !layoutFrozen}
          isResizable={inEditMode && !layoutFrozen}
          onRemoveItem={removePanelByID}
          setLocalCols={setLocalCols}
          setBreakpoint={setBreakpoint}
        />
      </LayoutStateContext.Provider>
    </div>
  )
}