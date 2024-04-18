import { AccountList } from '@devtable/settings-form';
import { Box } from '@mantine/core';
import { SettingsFormConfig } from '../../utils/config';
import { useLanguageContext } from '../../contexts';

export function AccountsPage() {
  const { lang } = useLanguageContext();
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <AccountList config={SettingsFormConfig} lang={lang} />
    </Box>
  );
}
