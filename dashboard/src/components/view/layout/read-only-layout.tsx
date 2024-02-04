import { observer } from 'mobx-react-lite';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useRenderContentModelContext } from '~/contexts';
import { ViewMetaInstance } from '~/model';
import { PanelRender } from '../../panel';
import './index.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface IReadOnlyDashboardLayout {
  view: ViewMetaInstance;
  className?: string;
}

export const ReadOnlyDashboardLayout = observer(function _ReadOnlyDashboardLayout({
  view,
  className = 'layout',
}: IReadOnlyDashboardLayout) {
  const contentModel = useRenderContentModelContext();
  const layoutItems = contentModel.layouts.items(view.panelIDs);
  const gridLayouts = contentModel.layouts.gridLayouts(view.panelIDs);
  return (
    <ResponsiveGridLayout
      className={`dashboard-layout ${className}`}
      rowHeight={1}
      margin={[0, 0]}
      isDraggable={false}
      isResizable={false}
      cols={contentModel.layouts.cols}
      layouts={gridLayouts}
      breakpoints={contentModel.layouts.breakpoints}
      onBreakpointChange={contentModel.layouts.setCurrentBreakpoint}
    >
      {layoutItems.map((l) => {
        return (
          <div key={l.id} className="panel-grid-item">
            <PanelRender view={view} panel={l.panel} />
          </div>
        );
      })}
    </ResponsiveGridLayout>
  );
});
