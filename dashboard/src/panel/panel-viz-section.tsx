import { Flex, LoadingOverlay } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PanelErrorOrStateMessage } from './panel-error-or-state-message';
import { Viz } from './viz';
import { PanelModelInstance } from '~/model';

export const PanelVizSection = observer(({ panel, height }: { panel: PanelModelInstance; height: string }) => {
  return (
    <Flex direction="column" sx={{ height, position: 'relative', width: '100%' }}>
      <LoadingOverlay visible={panel.dataLoading} exitTransitionDuration={0} />
      {!panel.canRenderViz && <PanelErrorOrStateMessage panel={panel} />}
      {panel.canRenderViz && <Viz viz={panel.viz} data={panel.data} />}
    </Flex>
  );
});
