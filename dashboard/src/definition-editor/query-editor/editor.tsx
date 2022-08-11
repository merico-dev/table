import { observer } from 'mobx-react-lite';
import React from 'react';
import { DashboardModelInstance } from '../../model';
import { QueryForm } from './form';

interface IQueryEditor {
  id: string;
  setID: React.Dispatch<React.SetStateAction<string>>;
  model: DashboardModelInstance;
}
export const QueryEditor = observer(function _QueryEditor({ id, setID, model }: IQueryEditor) {
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
