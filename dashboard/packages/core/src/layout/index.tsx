import React from "react";
import { WidthProvider, Responsive, Layout } from "react-grid-layout";
import _ from "lodash";
import { Panel } from "../panel";
import { IDashboardPanel } from "../types/dashboard";
import './index.css'
import { UseListStateHandlers } from "@mantine/hooks";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface IDashboardLayout {
  panels: IDashboardPanel[];
  setPanels:  UseListStateHandlers<IDashboardPanel>;
  className?: string;
  cols?: { lg: number, md: number, sm: number, xs: number, xxs: number };
  rowHeight?: number;
  onRemoveItem: (id: string) => void;
  isDraggable: boolean;
  isResizable: boolean;
  setLocalCols: React.Dispatch<React.SetStateAction<any>>;
  setBreakpoint: React.Dispatch<React.SetStateAction<any>>;
}

export function DashboardLayout({
  panels,
  setPanels,
  className = "layout",
  cols = { lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 },
  rowHeight = 10,
  onRemoveItem,
  isDraggable,
  isResizable,
  setLocalCols,
  setBreakpoint,
}: IDashboardLayout) {

  // We're using the cols coming back from this to calculate where to add new items.
  const onBreakpointChange = (breakpoint: any, localCols: any) => {
    setBreakpoint(breakpoint)
    setLocalCols(localCols)
  }

  const onLayoutChange = React.useCallback((currentLayout: Layout[]) => {
    const m = new Map()
    currentLayout.forEach(({ i, ...rest }) => {
      m.set(i, rest);
    })

    const newPanels = panels.map(p => ({
      ...p,
      layout: m.get(p.id),
    }))

    setPanels.setState(newPanels)
  }, [panels, setPanels])

  return (
    <ResponsiveReactGridLayout
      onBreakpointChange={onBreakpointChange}
      onLayoutChange={onLayoutChange}
      className={className}
      cols={cols}
      rowHeight={rowHeight}
      isDraggable={isDraggable}
      isResizable={isResizable}
    >
      {panels.map(({ id, ...rest }, index) => {
        return (
          <div key={id} data-grid={rest.layout}>
            <Panel
              id={id}
              {...rest}
              destroy={() => onRemoveItem(id)}
              update={(panel: IDashboardPanel) => {
                setPanels.setItem(index, panel)
              }}
            />
          </div>
        )
      })}
    </ResponsiveReactGridLayout>
  )
}