import { ActionIcon } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { ArrowsMove, ChevronDownRight } from 'tabler-icons-react';
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

export const DashboardLayout = observer(function _DashboardLayout({
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
      draggableHandle=".react-grid-customDragHandle"
      resizeHandle={
        <ActionIcon
          className="react-grid-customResizeHandle"
          sx={{
            userSelect: 'none',
            cursor: 'grab',
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 300,
            '&:hover': { color: '#228be6' },
          }}
          variant="transparent"
        >
          <ChevronDownRight size={16} />
        </ActionIcon>
      }
    >
      {panels.map(({ id, ...rest }, index) => {
        return (
          <div key={id} data-grid={rest.layout} style={{ position: 'relative' }}>
            {isDraggable && (
              <ActionIcon
                className="react-grid-customDragHandle"
                sx={{
                  userSelect: 'none',
                  cursor: 'grab',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  zIndex: 300,
                  '&:hover': { color: '#228be6' },
                }}
                variant="transparent"
              >
                <ArrowsMove size={16} />
              </ActionIcon>
            )}
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
});
