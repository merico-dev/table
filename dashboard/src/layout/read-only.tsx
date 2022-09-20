import { observer } from 'mobx-react-lite';
import RGL, { WidthProvider } from 'react-grid-layout';
import { useModelContext } from '~/contexts';
import { Panel } from '../panel';
import './index.css';

const ReactGridLayout = WidthProvider(RGL);

interface IReadOnlyDashboardLayout {
  className?: string;
  rowHeight?: number;
}

export const ReadOnlyDashboardLayout = observer(function _ReadOnlyDashboardLayout({
  className = 'layout',
  rowHeight = 10,
}: IReadOnlyDashboardLayout) {
  const model = useModelContext();
  return (
    <ReactGridLayout
      className={`dashboard-layout ${className}`}
      rowHeight={rowHeight}
      isDraggable={false}
      isResizable={false}
      layout={model.panels.layouts}
    >
      {model.panels.current.map(({ id, ...rest }) => {
        return (
          <div key={id} data-grid={rest.layout}>
            <Panel id={id} {...rest} />
          </div>
        );
      })}
    </ReactGridLayout>
  );
});
