import { observer } from 'mobx-react-lite';
import RGL, { WidthProvider } from 'react-grid-layout';
import { useRenderContentModelContext } from '~/contexts';
import { ViewMetaInstance } from '~/model';
import { PanelRender } from '../../panel';
import './index.css';

const ReactGridLayout = WidthProvider(RGL);

interface IReadOnlyDashboardLayout {
  view: ViewMetaInstance;
  className?: string;
}

export const ReadOnlyDashboardLayout = observer(function _ReadOnlyDashboardLayout({
  view,
  className = 'layout',
}: IReadOnlyDashboardLayout) {
  const contentModel = useRenderContentModelContext();
  return (
    <ReactGridLayout
      className={`dashboard-layout ${className}`}
      cols={36}
      rowHeight={1}
      margin={[0, 0]}
      isDraggable={false}
      isResizable={false}
      layout={contentModel.layouts.pureLayouts}
    >
      {/* TODO: load by breakpoint */}
      {contentModel.layouts.tempLayouts.map((l) => {
        return (
          <div key={l.id} data-grid={{ ...l.layoutProperies }} className="panel-grid-item">
            <PanelRender view={view} panel={l.panel} />
          </div>
        );
      })}
    </ReactGridLayout>
  );
});
