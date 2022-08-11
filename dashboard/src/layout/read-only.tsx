import React from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import _ from 'lodash';
import { Panel } from '../panel';
import { IDashboardPanel } from '../types/dashboard';
import './index.css';
import { DashboardModelInstance } from '../model';
import { observer } from 'mobx-react-lite';

const ReactGridLayout = WidthProvider(RGL);

interface IReadOnlyDashboardLayout {
  panels: IDashboardPanel[];
  className?: string;
  rowHeight?: number;
  model: DashboardModelInstance;
}

export const ReadOnlyDashboardLayout = observer(function _ReadOnlyDashboardLayout({
  panels,
  className = 'layout',
  rowHeight = 10,
  model,
}: IReadOnlyDashboardLayout) {
  return (
    <ReactGridLayout
      className={`dashboard-layout ${className}`}
      rowHeight={rowHeight}
      isDraggable={false}
      isResizable={false}
    >
      {panels.map(({ id, ...rest }) => {
        return (
          <div key={id} data-grid={rest.layout}>
            <Panel id={id} {...rest} model={model} />
          </div>
        );
      })}
    </ReactGridLayout>
  );
});
