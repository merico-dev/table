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
import { DefinitionContext } from '../contexts';
import { ErrorBoundary } from './error-boundary';

interface IPanel extends IDashboardPanel {
  destroy?: () => void;
  update?: (panel: IDashboardPanel) => void;
}

export function Panel({ viz: initialViz, dataSourceID: initialDataSourceID, title: initialTitle, description: initialDesc, update, layout, id, }: IPanel) {
  const contextInfo = React.useContext(ContextInfoContext);
  const definitions = React.useContext(DefinitionContext);
  const [title, setTitle] = React.useState(initialTitle)
  const [description, setDescription] = React.useState(initialDesc)
  const [dataSourceID, setDataSourceID] = React.useState(initialDataSourceID);
  const [viz, setViz] = React.useState(initialViz);

  if (!initialDataSourceID) {
    console.log(id)
  }

  const dataSource = React.useMemo(() => {
    if (!dataSourceID) {
      return undefined;
    }
    return definitions.dataSources.find(d => d.id === dataSourceID);

  }, [dataSourceID, definitions.dataSources]);

  React.useEffect(() => {
    update?.({
      id,
      layout,
      title,
      description,
      dataSourceID,
      viz,
    });
  }, [title, description, dataSource, viz, id, layout, dataSourceID])

  const { data = [], loading, refresh } = useRequest(queryBySQL({
    context: contextInfo,
    definitions,
    title,
    dataSource,
  }), {
    refreshDeps: [contextInfo, definitions],
  });
  const refreshData = refresh;
  return (
    <PanelContext.Provider
      value={{
        data,
        loading,
        title,
        setTitle,
        description,
        setDescription,
        dataSourceID,
        setDataSourceID,
        viz,
        setViz,
        refreshData,
      }}
    >
      <Container className="panel-root">
        <PanelTitleBar />
        <ErrorBoundary>
          <Viz viz={viz} data={data} loading={loading} />
        </ErrorBoundary>
      </Container>
    </PanelContext.Provider>
  )
}