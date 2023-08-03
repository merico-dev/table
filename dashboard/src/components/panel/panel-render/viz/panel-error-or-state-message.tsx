import { Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PanelRenderModelInstance } from '~/model';

export const PanelErrorOrStateMessage = observer(({ panel }: { panel: PanelRenderModelInstance }) => {
  return (
    <Stack>
      {panel.queryErrors.map((err, i) => (
        <Text key={`${i}-${err}`} color="red" size="md" align="center" sx={{ fontFamily: 'monospace' }}>
          {err}
        </Text>
      ))}

      {panel.queryStateMessages.map((msg, i) => (
        <Text key={`${i}-${msg}`} color="gray" align="center">
          {msg}
        </Text>
      ))}
    </Stack>
  );
});
