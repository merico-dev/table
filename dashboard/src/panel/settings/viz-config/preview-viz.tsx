import React from 'react';
import { PanelContext } from '../../../contexts';
import { Viz } from '../../viz';

export function PreviewViz() {
  const { data, loading, viz } = React.useContext(PanelContext);
  return <Viz viz={viz} data={data} loading={loading} />;
}
