import { Divider, Stack } from '@mantine/core';
import { EditDescription } from './description';
import { EditStyle } from './edit-style';
import { EditName } from './name';

export function PanelConfig() {
  return (
    <Stack sx={{ height: '100%' }}>
      <EditStyle />
      <Divider label="Info" labelPosition="center" variant="dashed" />
      <EditName />
      <EditDescription />
    </Stack>
  );
}
