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
import { ErrorBoundary } from './error-boundary';

interface IPanel extends IDashboardPanel {
  update?: (panel: IDashboardPanel) => void;
}

export function Panel({ viz: initialViz, queryID: initialQueryID, title: initialTitle, description: initialDesc, update, layout, id, }: IPanel) {
  const contextInfo = React.useContext(ContextInfoContext);
  const filterValues = React.useContext(FilterValuesContext);
  const definitions = React.useContext(DefinitionContext);
  const [title, setTitle] = React.useState(initialTitle)
  const [description, setDescription] = React.useState(initialDesc)
  const [queryID, setQueryID] = React.useState(initialQueryID);
  const [viz, setViz] = React.useState(initialViz);

  const query = React.useMemo(() => {
    if (!queryID) {
      return undefined;
    }
    return definitions.queries.find(d => d.id === queryID);

  }, [queryID, definitions.queries]);

  React.useEffect(() => {
    update?.({
      id,
      layout,
      title,
      description,
      queryID,
      viz,
    });
  }, [title, description, query, viz, id, layout, queryID])

  const { data = [], loading, refresh } = useRequest(queryBySQL({
    context: contextInfo,
    definitions,
    filterValues,
    title,
    query,
  }), {
    refreshDeps: [contextInfo, definitions, query, filterValues],
  });
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
        <PanelTitleBar />
        <Viz viz={viz} data={data} loading={loading} />
      </Container>
    </PanelContext.Provider>
  )
}