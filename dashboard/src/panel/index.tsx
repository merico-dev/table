import { Container } from '@mantine/core';
import { useRequest } from 'ahooks';
import React from 'react';
import { queryBySQL } from '../api-caller';
import { ContextInfoContext } from '../contexts/context-info-context';
import { PanelContext } from '../contexts/panel-context';
import { PanelTitleBar } from './title-bar';
import { Viz } from './viz';
import './index.css';
import { IDashboardPanel } from '../types/dashboard';
import { DefinitionContext, FilterValuesContext } from '../contexts';
import { DashboardModelInstance } from '../model';

interface IPanel extends IDashboardPanel {
  update?: (panel: IDashboardPanel) => void;
  model: DashboardModelInstance;
}

export function Panel({
  viz: initialViz,
  queryID: initialQueryID,
  title: initialTitle,
  description: initialDesc,
  update,
  layout,
  id,
  model,
}: IPanel) {
  const contextInfo = React.useContext(ContextInfoContext);
  const filterValues = React.useContext(FilterValuesContext);
  const { sqlSnippets } = React.useContext(DefinitionContext);
  const [title, setTitle] = React.useState(initialTitle);
  const [description, setDescription] = React.useState(initialDesc);
  const [queryID, setQueryID] = React.useState(initialQueryID);
  const [viz, setViz] = React.useState(initialViz);

  const query = React.useMemo(() => {
    if (!queryID) {
      return undefined;
    }
    return model.queries.findByID(queryID);
  }, [queryID, model.queries]);

  React.useEffect(() => {
    update?.({
      id,
      layout,
      title,
      description,
      queryID,
      viz,
    });
  }, [title, description, query, viz, id, layout, queryID]);

  const {
    data = [],
    loading,
    refresh,
  } = useRequest(
    queryBySQL({
      context: contextInfo,
      sqlSnippets,
      filterValues,
      title,
      query,
    }),
    {
      refreshDeps: [contextInfo, sqlSnippets, query, filterValues],
    },
  );
  const refreshData = refresh;
  return (
    <PanelContext.Provider
      value={{
        id,
        data,
        loading,
        title,
        setTitle,
        description,
        setDescription,
        queryID,
        setQueryID,
        viz,
        setViz,
        refreshData,
      }}
    >
      <Container className="panel-root">
        <PanelTitleBar model={model} />
        <Viz viz={viz} data={data} loading={loading} />
      </Container>
    </PanelContext.Provider>
  );
}
