import { observer } from 'mobx-react-lite';
import RGL, { WidthProvider } from 'react-grid-layout';
import { useModelContext } from '~/contexts';
import { ViewModelInstance } from '~/model';
import { Panel } from '../../panel';
import './index.css';

const ReactGridLayout = WidthProvider(RGL);

interface IReadOnlyDashboardLayout {
  view: ViewModelInstance;
  className?: string;
  rowHeight?: number;
}

export const ReadOnlyDashboardLayout = observer(function _ReadOnlyDashboardLayout({
  view,
  className = 'layout',
  rowHeight = 10,
}: IReadOnlyDashboardLayout) {
  const { panels, layouts } = useModelContext().panels.panelsByIDs(view.panelIDs);
  return (
    <ReactGridLayout
      className={`dashboard-layout ${className}`}
      rowHeight={rowHeight}
      isDraggable={false}
      isResizable={false}
      layout={layouts}
    >
      {panels.map((panel) => {
        return (
          <div key={panel.id} data-grid={panel.layout}>
            <Panel view={view} panel={panel} />
          </div>
        );
      })}
    </ReactGridLayout>
  );
});
