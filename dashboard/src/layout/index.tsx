import { ActionIcon } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { ArrowsMove, ChevronDownRight } from 'tabler-icons-react';
import { useModelContext } from '~/contexts';
import { Panel } from '../panel';
import { IDashboardPanel } from '../types/dashboard';
import './index.css';

const ReactGridLayout = WidthProvider(RGL);

interface IDashboardLayout {
  className?: string;
  rowHeight?: number;
  isDraggable: boolean;
  isResizable: boolean;
}

export const DashboardLayout = observer(function _DashboardLayout({
  className = 'layout',
  rowHeight = 10,
  isDraggable,
  isResizable,
}: IDashboardLayout) {
  const model = useModelContext();
  const onLayoutChange = React.useCallback(
    (currentLayout: Layout[]) => {
      currentLayout.forEach(({ i, ...rest }) => {
        const p = model.panels.findByID(i);
        if (!p) {
          return;
        }
        p.layout.set(rest);
      });
    },
    [model],
  );

  return (
    <ReactGridLayout
      onLayoutChange={onLayoutChange}
      className={`dashboard-layout ${className}`}
      rowHeight={rowHeight}
      layout={model.panels.layouts}
      isDraggable={isDraggable}
      isResizable={isResizable}
      draggableHandle=".react-grid-customDragHandle"
      resizeHandle={
        <ActionIcon
          className="react-grid-customResizeHandle"
          sx={{
            userSelect: 'none',
            cursor: 'nwse-resize',
            position: 'absolute',
            bottom: -5,
            right: -5,
            zIndex: 300,
            '&:hover': { color: '#228be6' },
          }}
          variant="transparent"
        >
          <ChevronDownRight size={16} />
        </ActionIcon>
      }
    >
      {model.panels.current.map(({ id, ...rest }, index) => {
        return (
          <div key={id} data-grid={{ ...rest.layout }} style={{ position: 'relative' }}>
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
            <Panel id={id} {...rest} />
          </div>
        );
      })}
    </ReactGridLayout>
  );
});
