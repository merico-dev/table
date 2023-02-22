import { Divider, Stack } from '@mantine/core';
import { EditDescription } from './description';
import { EditStyle } from './edit-style';
import { EditTitle } from './title';

export function PanelConfig() {
  return (
    <Stack sx={{ height: '100%' }}>
      <Divider label="Style" labelPosition="center" variant="dashed" />
      <EditStyle />
      <Divider label="Info" labelPosition="center" variant="dashed" />
      <EditTitle />
      <EditDescription />
    </Stack>
  );
}
