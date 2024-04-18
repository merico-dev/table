import { APIKeyList } from '@devtable/settings-form';
import { Box } from '@mantine/core';
import { SettingsFormConfig } from '../../utils/config';
import { useLanguageContext } from '../../contexts';

export function APIKeyPage() {
  const { lang } = useLanguageContext();
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <APIKeyList config={SettingsFormConfig} lang={lang} />
    </Box>
  );
}
