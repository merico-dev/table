import { usePanelContext } from '../../../contexts';
import { Viz } from '../../viz';

export function PreviewViz() {
  const {
    data,
    loading,
    panel: { viz },
  } = usePanelContext();
  return <Viz viz={viz} data={data} loading={loading} height="100%" />;
}
