import { Container } from '@mantine/core';
import { useWhyDidYouUpdate } from 'ahooks';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { ViewModelInstance } from '..';
import { useModelContext } from '../contexts';
import { PanelContext } from '../contexts/panel-context';
import { IDashboardPanel } from '../types/dashboard';
import './index.css';
import { PanelTitleBar } from './title-bar';
import { Viz } from './viz';

function doesVizRequiresData(type: string) {
  const vizTypes = ['richText'];
  return !vizTypes.includes(type);
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IPanel extends IDashboardPanel {
  view: ViewModelInstance;
}

export const Panel = observer(function _Panel({
  viz: initialViz,
  queryID: initialQueryID,
  title: initialTitle,
  description: initialDesc,
  id,
  view,
}: IPanel) {
  const model = useModelContext();
  const [title, setTitle] = React.useState(initialTitle);
  const [description, setDescription] = React.useState(initialDesc);
  const [queryID, setQueryID] = React.useState(initialQueryID);
  const [viz, setViz] = React.useState(initialViz);
  useWhyDidYouUpdate('Panel', { title, description, queryID, viz, id });

  React.useEffect(() => {
    const panel = view.panels.findByID(id);
    if (!panel) {
      return;
    }
    panel.setTitle(title);
    panel.setDescription(description);
    panel.setQueryID(queryID);
    panel.viz.setType(viz.type);
    panel.viz.setConf(viz.conf);
  }, [title, description, viz, id, queryID]);

  const { data, state } = model.getDataStuffByID(queryID);
  const loading = doesVizRequiresData(viz.type) && state === 'loading';
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
        <PanelTitleBar view={view} />
        <Viz viz={viz} data={data} loading={loading} />
      </Container>
    </PanelContext.Provider>
  );
});
