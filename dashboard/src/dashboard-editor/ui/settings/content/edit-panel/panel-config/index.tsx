import { Divider, Stack } from '@mantine/core';
import { EditDescription } from './description';
import { EditStyle } from './edit-style';
import { EditTitle } from './title';

export function PanelConfig() {
  return (
    <Stack sx={{ height: '100%' }}>
      <EditStyle />
      <Divider label="Info" labelPosition="center" variant="dashed" />
      <EditTitle />
      <EditDescription />
    </Stack>
  );
}
