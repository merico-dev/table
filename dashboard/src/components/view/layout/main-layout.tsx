import { ActionIcon } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import RGL, { Layout, WidthProvider } from 'react-grid-layout';
import { ArrowsMove, ChevronDownRight } from 'tabler-icons-react';
import { useRenderContentModelContext } from '~/contexts';
import { ViewMetaInstance } from '~/model';
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
  view: ViewMetaInstance;
  className?: string;
}

export const MainDashboardLayout = observer(({ view, className = 'layout' }: IMainDashboardLayout) => {
  const contentModel = useRenderContentModelContext();
  const onLayoutChange = React.useCallback(
    (currentLayout: Layout[]) => {
      currentLayout.forEach(({ i, ...rest }) => {
        // TODO: find layout by panelID, then set it
        // const p = contentModel.panels.findByID(i);
        // if (!p) {
        //   return;
        // }
        // p.layout.set(rest);
      });
    },
    [contentModel],
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
      layout={contentModel.layouts.pureLayouts}
      draggableHandle=".react-grid-customDragHandle"
      resizeHandle={<CustomResizeHandle />}
      onResize={onResize}
    >
      {/* TODO: load by breakpoint */}
      {contentModel.layouts.tempLayouts.map((l, index) => {
        return (
          <div key={l.id} data-grid={{ ...l.layoutProperies }} className="panel-grid-item">
            <CustomDragHandle h={l.h} />
            <Panel view={view} panel={l.panel} />
          </div>
        );
      })}
    </ReactGridLayout>
  );
});
