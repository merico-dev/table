import { ActionIcon } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { ArrowsMove, ChevronDownRight } from 'tabler-icons-react';
import { useContentModelContext } from '~/contexts';
import { ViewModelInstance } from '~/model';
import { Panel } from '../../panel';
import './index.css';

const CustomDragHandle = React.forwardRef(({ h }: { h: number }, ref: $TSFixMe) => (
  <ActionIcon
    ref={ref}
    className="react-grid-customDragHandle"
    sx={{
      userSelect: 'none',
      cursor: 'grab',
      position: 'absolute',
      top: 5,
      right: h > 38 ? 5 : 20,
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
      bottom: 0,
      right: 0,
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
}

export const MainDashboardLayout = observer(({ view, className = 'layout' }: IMainDashboardLayout) => {
  const model = useContentModelContext();
  const { panels, layouts } = model.panels.panelsByIDs(view.panelIDs);

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

  const onResize = (_layout: any, _oldLayoutItem: any, layoutItem: any, placeholder: any) => {
    if (layoutItem.h < 30) {
      layoutItem.h = 30;
      placeholder.h = 30;
    }

    if (layoutItem.w < 4) {
      layoutItem.w = 4;
      placeholder.w = 4;
    }
  };

  return (
    <ReactGridLayout
      onLayoutChange={onLayoutChange}
      className={`dashboard-layout ${className}`}
      rowHeight={1}
      cols={36}
      margin={[0, 0]}
      isBounded={true}
      isDraggable
      isResizable
      layout={layouts}
      draggableHandle=".react-grid-customDragHandle"
      resizeHandle={<CustomResizeHandle />}
      onResize={onResize}
    >
      {panels.map((panel, index) => {
        return (
          <div key={panel.id} data-grid={{ ...panel.layout }} className="panel-grid-item">
            <CustomDragHandle h={panel.layout.h} />
            <Panel view={view} panel={panel} />
          </div>
        );
      })}
    </ReactGridLayout>
  );
});
