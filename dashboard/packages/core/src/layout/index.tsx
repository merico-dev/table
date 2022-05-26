import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import { Panel } from "../panel";
import { IDashboardPanel } from "../types/dashboard";
import './index.css'

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface IDashboardLayout {
  panels: IDashboardPanel[];
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

  return (
    <ResponsiveReactGridLayout
      onBreakpointChange={onBreakpointChange}
      className={className}
      cols={cols}
      rowHeight={rowHeight}
      isDraggable={isDraggable}
      isResizable={isResizable}
    >
      {panels.map(({ id, ...rest }) => {
        return (
          <div key={id} data-grid={rest.layout}>
            <Panel destroy={() => onRemoveItem(id)} {...rest} />
          </div>
        )
      })}
    </ResponsiveReactGridLayout>
  )
}