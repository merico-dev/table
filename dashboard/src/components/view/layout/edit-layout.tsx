import { ActionIcon, Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ItemCallback, Responsive, WidthProvider } from 'react-grid-layout';

import { IconArrowsMove, IconChevronDownRight, IconGripVertical, IconMenu2 } from '@tabler/icons-react';
import { useEditContentModelContext } from '~/contexts';
import { ViewMetaInstance } from '~/model';
import { Panel } from '../../panel';
import './index.css';
import { useTranslation } from 'react-i18next';

const CustomDragHandle = React.forwardRef(({ title }: { title: string }, ref: $TSFixMe) => (
  <Box ref={ref} className="react-grid-customDragHandle" title={title}>
    <ActionIcon variant="transparent" color="gray">
      <IconMenu2 size={16} />
    </ActionIcon>
  </Box>
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
    <IconChevronDownRight size={16} />
  </ActionIcon>
));

const ResponsiveGridLayout = WidthProvider(Responsive);

interface IEditLayout {
  view: ViewMetaInstance;
  className?: string;
}

export const EditLayout = observer(({ view, className = 'layout' }: IEditLayout) => {
  const { t } = useTranslation();
  const contentModel = useEditContentModelContext();
  const layoutsModel = contentModel.layouts;
  const layoutItems = layoutsModel.items(view.panelIDs);
  const gridLayouts = layoutsModel.gridLayouts(view.panelIDs);

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

  const onResizeStop: ItemCallback = (layouts, oldItem, newItem) => {
    console.log('🔴 onResizeStop', { layouts, oldItem, newItem });
    layoutsModel.updateCurrentLayoutItem(newItem);
  };

  const onDragStop: ItemCallback = (layouts, oldItem, newItem) => {
    console.log('🔴 onDragStop', { layouts, oldItem, newItem });
    layoutsModel.updateCurrentLayoutItems(layouts);
  };

  return (
    <ResponsiveGridLayout
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
      onResizeStop={onResizeStop}
      onDragStop={onDragStop}
      width={layoutsModel.currentLayoutPreviewWidth}
    >
      {layoutItems.map((l) => {
        return (
          <div key={l.id} data-grid={l.layoutProperies} className="panel-grid-item">
            <CustomDragHandle title={t(`view.layout.drag_to_move`)} />
            <Panel view={view} panel={l.panel} />
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
});
