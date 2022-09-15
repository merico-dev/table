import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import { Panel } from '../panel';
import { IDashboardPanel } from '../types/dashboard';
import './index.css';

const ReactGridLayout = WidthProvider(RGL);

interface IReadOnlyDashboardLayout {
  panels: IDashboardPanel[];
  className?: string;
  rowHeight?: number;
}

export const ReadOnlyDashboardLayout = observer(function _ReadOnlyDashboardLayout({
  panels,
  className = 'layout',
  rowHeight = 10,
}: IReadOnlyDashboardLayout) {
  const children = useMemo(() => {
    return panels.map(({ id, ...rest }) => {
      return (
        <div key={id} data-grid={rest.layout}>
          <Panel id={id} {...rest} />
        </div>
      );
    });
  }, [panels]);
  const layout = useMemo(() => panels.map(({ id, layout }) => ({ ...layout, i: id })), [panels]);
  return (
    <ReactGridLayout
      className={`dashboard-layout ${className}`}
      rowHeight={rowHeight}
      isDraggable={false}
      isResizable={false}
      layout={layout}
    >
      {children}
    </ReactGridLayout>
  );
});
