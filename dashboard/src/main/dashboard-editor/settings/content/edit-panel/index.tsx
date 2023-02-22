import { Box, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { PanelEditor } from './panel-editor';

export const EditPanel = observer(({ viewID, panelID }: { viewID: string; panelID: string }) => {
  const model = useModelContext();
  const view = model.views.findByID(viewID);
  if (!view) {
    return <Text size={14}>View by ID[{viewID}] is not found</Text>;
  }
  const panel = view.panels.findByID(panelID);
  if (!panel) {
    return <Text size={14}>Panel by ID[{panelID}] is not found</Text>;
  }
  return <PanelEditor panel={panel} />;
});
