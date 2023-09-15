import { Flex, LoadingOverlay } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PanelRenderModelInstance } from '~/model';
import { PanelErrorOrStateMessage } from './panel-error-or-state-message';
import { Viz } from './viz';

export const PanelVizSection = observer(({ panel }: { panel: PanelRenderModelInstance }) => {
  return (
    <Flex className="panel-viz-section" direction="column" sx={{ position: 'relative', width: '100%' }}>
      <LoadingOverlay visible={panel.dataLoading} exitTransitionDuration={0} />
      {!panel.canRenderViz && <PanelErrorOrStateMessage panel={panel} />}
      {panel.canRenderViz && <Viz data={panel.data} />}
    </Flex>
  );
});
