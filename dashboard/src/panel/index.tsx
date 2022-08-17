import { Container } from '@mantine/core';
import React from 'react';
import { PanelContext } from '../contexts/panel-context';
import { PanelTitleBar } from './title-bar';
import { Viz } from './viz';
import './index.css';
import { IDashboardPanel } from '../types/dashboard';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '../contexts';

interface IPanel extends IDashboardPanel {
  update?: (panel: IDashboardPanel) => void;
}

export const Panel = observer(function _Panel({
  viz: initialViz,
  queryID: initialQueryID,
  title: initialTitle,
  description: initialDesc,
  update,
  layout,
  id,
}: IPanel) {
  const model = useModelContext();
  const [title, setTitle] = React.useState(initialTitle);
  const [description, setDescription] = React.useState(initialDesc);
  const [queryID, setQueryID] = React.useState(initialQueryID);
  const [viz, setViz] = React.useState(initialViz);

  React.useEffect(() => {
    update?.({
      id,
      layout,
      title,
      description,
      queryID,
      viz,
    });
  }, [title, description, viz, id, layout, queryID]);

  const { data, state, error } = model.getDataStuffByID(queryID);
  const loading = state === 'loading';
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
      }}
    >
      <Container className="panel-root">
        <PanelTitleBar />
        <Viz viz={viz} data={data} loading={loading} />
      </Container>
    </PanelContext.Provider>
  );
});
