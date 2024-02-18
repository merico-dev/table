import { ActionIcon, Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Responsive, Layout, WidthProvider } from 'react-grid-layout';
import { ArrowsMove, ChevronDownRight } from 'tabler-icons-react';
import { useEditContentModelContext, useRenderContentModelContext } from '~/contexts';
import { ViewMetaInstance } from '~/model';
import { Panel } from '../../panel';
import './index.css';
import { c } from 'vitest/dist/reporters-5f784f42';

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

const ResponsiveGridLayout = WidthProvider(Responsive);

interface IMainDashboardLayout {
  view: ViewMetaInstance;
  className?: string;
}

export const MainDashboardLayout = observer(({ view, className = 'layout' }: IMainDashboardLayout) => {
  const contentModel = useEditContentModelContext();
  const layoutsModel = contentModel.layouts;
  const layoutItems = layoutsModel.items(view.panelIDs);
  const gridLayouts = layoutsModel.gridLayouts(view.panelIDs);

  const onLayoutChange = React.useCallback(
    (currentLayout: Layout[], allLayouts: Record<string, Layout[]>) => {
      console.log('🔴 onLayoutChange', currentLayout, allLayouts);
      layoutsModel.updateCurrentLayoutItems(allLayouts);
    },
    [contentModel],
  );

  const onResize = (_layout: any, _oldLayoutItem: any, layoutItem: any, placeholder: any) => {
    console.log('🔴 onResize', _layout);
    if (layoutItem.h < 30) {
      layoutItem.h = 30;
      placeholder.h = 30;
    }

    if (layoutItem.w < 4) {
      layoutItem.w = 4;
      placeholder.w = 4;
    }
  };

  // console.log(
  //   '🔵',
  //   layoutsModel.currentBreakpoint,
  //   layoutItems.map((i) => i.json),
  // );
  console.log('⚡️layoutsModel.currentLayoutPreviewWidth', layoutsModel.currentLayoutPreviewWidth);
  return (
    <Box sx={{ minHeight: '100%', background: '#efefef' }}>
      <Box
        w={layoutsModel.currentLayoutPreviewWidth}
        sx={{ minHeight: '100%', paddingBottom: '100px', background: 'blue', margin: '0 auto' }}
      >
        <ResponsiveGridLayout
          onLayoutChange={onLayoutChange}
          className={`dashboard-layout ${className}`}
          rowHeight={1}
          margin={[0, 0]}
          isBounded={true}
          isDraggable
          isResizable
          cols={layoutsModel.cols}
          layouts={gridLayouts}
          draggableHandle=".react-grid-customDragHandle"
          resizeHandle={<CustomResizeHandle />}
          onResize={onResize}
          breakpoints={layoutsModel.breakpoints}
          onBreakpointChange={layoutsModel.setCurrentBreakpoint}
          onDragStop={(...args) => {
            console.log('🔴 onDragStop', ...args);
          }}
          width={layoutsModel.currentLayoutPreviewWidth}
        >
          {layoutItems.map((l) => {
            return (
              <div key={l.id} className="panel-grid-item">
                <CustomDragHandle h={l.h} />
                <Panel view={view} panel={l.panel} />
              </div>
            );
          })}
        </ResponsiveGridLayout>
      </Box>
    </Box>
  );
});
