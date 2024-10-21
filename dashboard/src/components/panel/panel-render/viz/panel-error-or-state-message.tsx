import { Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PanelRenderModelInstance } from '~/model';

export const PanelErrorOrStateMessage = observer(({ panel }: { panel: PanelRenderModelInstance }) => {
  return (
    <Stack>
      {panel.queryErrors.map((err, i) => (
        <Text key={`${i}-${err}`} c="red" size="sm" ta="center" ff="monospace">
          {err}
        </Text>
      ))}

      <Text c="gray" ta="center" size="sm">
        {panel.queryStateMessages}
      </Text>
    </Stack>
  );
});
