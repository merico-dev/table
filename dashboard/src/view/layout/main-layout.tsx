import { ActionIcon } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { ArrowsMove, ChevronDownRight } from 'tabler-icons-react';
import { ViewModelInstance } from '~/model';
import { Panel } from '../../panel';
import './index.css';

const CustomDragHandle = React.forwardRef(({ handleAxis }: $TSFixMe, ref: $TSFixMe) => (
  <ActionIcon
    ref={ref}
    className="react-grid-customDragHandle"
    sx={{
      userSelect: 'none',
      cursor: 'grab',
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 400,
      '&:hover': { color: '#228be6' },
    }}
    variant="transparent"
  >
    <ArrowsMove size={16} />
  </ActionIcon>
));

const CustomResizeHandle = React.forwardRef(({ handleAxis, ...rest }: $TSFixMe, ref: $TSFixMe) => (
  <ActionIcon
    ref={ref}
    className="react-grid-customResizeHandle"
    sx={{
      userSelect: 'none',
      cursor: 'nwse-resize',
      position: 'absolute',
      bottom: -5,
      right: -5,
      zIndex: 400,
      '&:hover': { color: '#228be6' },
    }}
    variant="transparent"
    {...rest}
  >
    <ChevronDownRight size={16} />
  </ActionIcon>
));

const ReactGridLayout = WidthProvider(RGL);

interface IMainDashboardLayout {
  view: ViewModelInstance;
  className?: string;
  rowHeight?: number;
  isDraggable: boolean;
  isResizable: boolean;
}

export const MainDashboardLayout = observer(function _MainDashboardLayout({
  view,
  className = 'layout',
  rowHeight = 10,
  isDraggable,
  isResizable,
}: IMainDashboardLayout) {
  const onLayoutChange = React.useCallback(
    (currentLayout: Layout[]) => {
      currentLayout.forEach(({ i, ...rest }) => {
        const p = view.panels.findByID(i);
        if (!p) {
          return;
        }
        p.layout.set(rest);
      });
    },
    [view],
  );

  return (
    <ReactGridLayout
      onLayoutChange={onLayoutChange}
      className={`dashboard-layout ${className}`}
      rowHeight={rowHeight}
      layout={view.panels.layouts}
      isDraggable={isDraggable}
      isResizable={isResizable}
      draggableHandle=".react-grid-customDragHandle"
      resizeHandle={<CustomResizeHandle />}
    >
      {view.panels.list.map((panel, index) => {
        return (
          <div key={panel.id} data-grid={{ ...panel.layout }} style={{ position: 'relative' }}>
            {isDraggable && <CustomDragHandle />}
            <Panel view={view} panel={panel} />
          </div>
        );
      })}
    </ReactGridLayout>
  );
});
