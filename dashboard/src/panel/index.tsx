import { Box, Container } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PanelModelInstance } from '~/model/views/view/panels';
import { ViewModelInstance } from '..';
import { useModelContext } from '../contexts';
import { PanelContextProvider } from '../contexts/panel-context';
import './index.css';
import { DescriptionPopover } from './panel-description';
import { PanelTitleBar } from './title-bar';
import { Viz } from './viz';

function doesVizRequiresData(type: string) {
  const vizTypes = ['richText'];
  return !vizTypes.includes(type);
}

interface IPanel {
  view: ViewModelInstance;
  panel: PanelModelInstance;
}

export const Panel = observer(function _Panel({ panel, view }: IPanel) {
  const model = useModelContext();

  const { data, state } = model.getDataStuffByID(panel.queryID);
  const loading = doesVizRequiresData(panel.viz.type) && state === 'loading';
  return (
    <PanelContextProvider value={{ panel, data, loading }}>
      <Container className="panel-root">
        <Box sx={{ position: 'absolute', left: 0, top: 0, height: 28, zIndex: 310 }}>
          <DescriptionPopover />
        </Box>
        <PanelTitleBar view={view} />
        <Viz viz={panel.viz} data={data} loading={loading} />
      </Container>
    </PanelContextProvider>
  );
});
