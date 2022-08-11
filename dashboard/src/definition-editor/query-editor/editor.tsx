import { Group } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { DashboardModelInstance } from '../../model';
import { QueryModelInstance } from '../../model/queries';
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

  const update = React.useCallback(
    (value: QueryModelInstance) => {
      const index = model.queries.current.findIndex((d) => d.id === id);
      if (index === -1) {
        console.error(new Error('Invalid data source id when updating by id'));
        return;
      }
      model.queries.replaceByIndex(index, value);
      setID(value.id);
    },
    [id, model.queries, setID],
  );

  if (!id) {
    return null;
  }
  if (!query) {
    return <span>Invalid Data Source ID</span>;
  }
  return <QueryForm value={query} onChange={update} model={model} />;
});
