import { Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { PanelRenderModelInstance } from '~/model';

export const PanelErrorOrStateMessage = observer(({ panel }: { panel: PanelRenderModelInstance }) => {
  return (
    <Stack>
      {panel.queryErrors.map((err, i) => (
        <Text key={`${i}-${err}`} color="red" size="sm" align="center" sx={{ fontFamily: 'monospace' }}>
          {err}
        </Text>
      ))}

      <Text color="gray" align="center" size="sm">
        {panel.queryStateMessages}
      </Text>
    </Stack>
  );
});
