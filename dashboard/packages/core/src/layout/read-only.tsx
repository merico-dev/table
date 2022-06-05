import React from "react";
import { WidthProvider, Responsive } from "react-grid-layout";
import _ from "lodash";
import { Panel } from "../panel";
import { IDashboardPanel } from "../types/dashboard";
import './index.css'

const ResponsiveReactGridLayout = WidthProvider(Responsive);

interface IReadOnlyDashboardLayout {
  panels: IDashboardPanel[];
  className?: string;
  cols?: { lg: number, md: number, sm: number, xs: number, xxs: number };
  rowHeight?: number;
}

export function ReadOnlyDashboardLayout({
  panels,
  className = "layout",
  cols = { lg: 12, md: 10, sm: 8, xs: 6, xxs: 4 },
  rowHeight = 10,
}: IReadOnlyDashboardLayout) {
  return (
    <ResponsiveReactGridLayout
      className={className}
      cols={cols}
      rowHeight={rowHeight}
      isDraggable={false}
      isResizable={false}
    >
      {panels.map(({ id, ...rest }) => {
        return (
          <div key={id} data-grid={rest.layout}>
            <Panel id={id} {...rest} />
          </div>
        )
      })}
    </ResponsiveReactGridLayout>
  )
}