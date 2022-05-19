import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import './index.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { Panel } from "../panel";
import { DashboardMode, IDashboardItem } from "../../types/dashboard";
import { Button, Group } from "@mantine/core";
import { DeviceFloppy, PlaylistAdd, Recycle, Share } from "tabler-icons-react";
import LayoutStateContext from "../../contexts/layout-state-context";
import { ModeToggler } from "./toggle-mode";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface IDashboardLayout {
  dashboard: IDashboardItem[];
  className?: string;
  cols?: { lg: number, md: number, sm: number, xs: number, xxs: number };
  rowHeight?: number;
}

export function DashboardLayout({
  dashboard,
  className = "layout",
  cols = { lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 },
  rowHeight = 10,
}: IDashboardLayout) {
  const [layoutFrozen, freezeLayout] = React.useState(false);
  const [newCounter, setNewCounter] = React.useState(0)
  const [breakpoint, setBreakpoint] = React.useState()
  const [localCols, setLocalCols] = React.useState()
  const [items, setItems] = React.useState(dashboard)
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

  // We're using the cols coming back from this to calculate where to add new items.
  const onBreakpointChange = (breakpoint: any, localCols: any) => {
    setBreakpoint(breakpoint)
    setLocalCols(localCols)
  }

  const onRemoveItem = (i: string) => {
    console.log("removing", i);
    setItems(items => _.reject(items, { id: i }));
  }

  const inEditMode = mode === DashboardMode.Edit;
  return (
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
      <ResponsiveReactGridLayout
        onBreakpointChange={onBreakpointChange}
        className={className}
        cols={cols}
        rowHeight={rowHeight}
        isDraggable={inEditMode && !layoutFrozen}
        isResizable={inEditMode && !layoutFrozen}
      >
        {items.map(({ id, ...rest }) => {
          return (
            <div key={id} data-grid={rest.layout}>
              <Panel destroy={() => onRemoveItem(id)} {...rest} />
            </div>
          )
        })}
      </ResponsiveReactGridLayout>
    </LayoutStateContext.Provider>
  )
}