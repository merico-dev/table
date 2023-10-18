import { APIKeyList } from '@devtable/settings-form';
import { Box } from '@mantine/core';
import { SettingsFormConfig } from '../../utils/config';

export function APIKeyPage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <APIKeyList config={SettingsFormConfig} />
    </Box>
  );
}
