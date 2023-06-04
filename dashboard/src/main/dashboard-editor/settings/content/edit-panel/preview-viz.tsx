import { observer } from 'mobx-react-lite';
import { useContentModelContext, usePanelContext } from '../../../../../contexts';
import { Viz } from '../../../../../panel/viz';

export const PreviewViz = observer(({ height }: { height: string }) => {
  const content = useContentModelContext();
  const {
    data,
    loading,
    error,
    panel: { viz, queryID },
  } = usePanelContext();
  const query = content.queries.findByID(queryID);
  return <Viz viz={viz} data={data} loading={loading} error={error} query={query} height={height} />;
});
