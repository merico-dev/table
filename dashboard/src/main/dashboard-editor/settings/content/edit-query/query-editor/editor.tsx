import { observer } from 'mobx-react-lite';
import React from 'react';
import { useModelContext } from '../../../../../../contexts';
import { QueryForm } from './form';

interface IQueryEditor {
  id: string;
}
export const QueryEditor = observer(function _QueryEditor({ id }: IQueryEditor) {
  const model = useModelContext();
  const query = React.useMemo(() => {
    return model.queries.findByID(id);
  }, [model.queries, id]);

  if (!id) {
    return null;
  }
  if (!query) {
    return <span>Invalid Query ID</span>;
  }
  return <QueryForm queryModel={query} />;
});
