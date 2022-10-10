import { observer } from 'mobx-react-lite';
import RGL, { WidthProvider } from 'react-grid-layout';
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
  return (
    <ReactGridLayout
      className={`dashboard-layout ${className}`}
      rowHeight={rowHeight}
      isDraggable={false}
      isResizable={false}
      layout={view.panels.layouts}
    >
      {view.panels.current.map(({ id, ...rest }) => {
        return (
          <div key={id} data-grid={rest.layout}>
            <Panel id={id} view={view} {...rest} />
          </div>
        );
      })}
    </ReactGridLayout>
  );
});
