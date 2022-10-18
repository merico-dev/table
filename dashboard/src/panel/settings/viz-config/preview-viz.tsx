import { observer } from 'mobx-react-lite';
import { usePanelContext } from '../../../contexts';
import { Viz } from '../../viz';

export const PreviewViz = observer(() => {
  const {
    data,
    loading,
    panel: { viz },
  } = usePanelContext();
  return <Viz viz={viz} data={data} loading={loading} height="100%" />;
});
