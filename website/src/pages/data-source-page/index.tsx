import { DataSourceList } from '@devtable/settings-form';
import { Box } from '@mantine/core';
import { SettingsFormConfig } from '../../utils/config';

export function DataSourcePage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <DataSourceList config={SettingsFormConfig} />
    </Box>
  );
}
