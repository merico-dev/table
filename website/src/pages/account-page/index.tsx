import { AccountList } from '@devtable/settings-form';
import { Box } from '@mantine/core';
import { SettingsFormConfig } from '../../utils/config';

export function AccountsPage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <AccountList config={SettingsFormConfig} />
    </Box>
  );
}
