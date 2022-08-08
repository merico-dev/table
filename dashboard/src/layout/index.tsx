import React from 'react';
import RGL, { WidthProvider, Layout } from 'react-grid-layout';
import _ from 'lodash';
import { Panel } from '../panel';
import { IDashboardPanel } from '../types/dashboard';
import './index.css';

const ReactGridLayout = WidthProvider(RGL);

interface IDashboardLayout {
  panels: IDashboardPanel[];
  setPanels: React.Dispatch<React.SetStateAction<IDashboardPanel[]>>;
  className?: string;
  rowHeight?: number;
  isDraggable: boolean;
  isResizable: boolean;
}

export function DashboardLayout({
  panels,
  setPanels,
  className = 'layout',
  rowHeight = 10,
  isDraggable,
  isResizable,
}: IDashboardLayout) {
  const onLayoutChange = React.useCallback(
    (currentLayout: Layout[]) => {
      const m = new Map();
      currentLayout.forEach(({ i, ...rest }) => {
        m.set(i, rest);
      });

      const newPanels = panels.map((p) => ({
        ...p,
        layout: m.get(p.id),
      }));

      setPanels(newPanels);
    },
    [panels, setPanels],
  );

  return (
    <ReactGridLayout
      onLayoutChange={onLayoutChange}
      className={`dashboard-layout ${className}`}
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
              update={(panel: IDashboardPanel) => {
                setPanels((prevs) => {
                  prevs.splice(index, 1, panel);
                  return [...prevs];
                });
              }}
            />
          </div>
        );
      })}
    </ReactGridLayout>
  );
}
