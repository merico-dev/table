import { SQLSnippetList } from '@devtable/settings-form';
import { Box } from '@mantine/core';
import { SettingsFormConfig } from '../../utils/config';

export function SQLSnippetPage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <SQLSnippetList config={SettingsFormConfig} />
    </Box>
  );
}
