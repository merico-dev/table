import { observer } from 'mobx-react-lite';
import RGL, { WidthProvider } from 'react-grid-layout';
import { useRenderContentModelContext } from '~/contexts';
import { ViewMetaInstance } from '~/model';
import { Panel } from '../../panel';
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
  const { panels, layouts } = useRenderContentModelContext().panels.panelsByIDs(view.panelIDs);
  return (
    <ReactGridLayout
      className={`dashboard-layout ${className}`}
      cols={36}
      rowHeight={1}
      margin={[0, 0]}
      isDraggable={false}
      isResizable={false}
      layout={layouts}
    >
      {panels.map((panel) => {
        return (
          <div key={panel.id} data-grid={{ ...panel.layout }} className="panel-grid-item">
            <Panel view={view} panel={panel} />
          </div>
        );
      })}
    </ReactGridLayout>
  );
});
