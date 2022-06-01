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

interface IPanel extends IDashboardPanel {
  destroy: () => void;
  update: (panel: IDashboardPanel) => void;
}

export function Panel({ viz: initialViz, sql: initialSQL, title: initialTitle, description: initialDesc, update, layout, id, }: IPanel) {
  const contextInfo = React.useContext(ContextInfoContext);
  const definitions = React.useContext(DefinitionContext);
  const [title, setTitle] = React.useState(initialTitle)
  const [description, setDescription] = React.useState(initialDesc)
  const [sql, setSQL] = React.useState(initialSQL);
  const [viz, setViz] = React.useState(initialViz);

  React.useEffect(() => {
    update({
      id,
      layout,
      title,
      description,
      sql,
      viz,
    });
  }, [title, description, sql, viz, id, layout])

  const { data = [], loading, refresh } = useRequest(queryBySQL(sql, contextInfo, definitions, title), {
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
        sql,
        setSQL,
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