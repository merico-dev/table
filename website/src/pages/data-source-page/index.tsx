import { DataSourceList } from '@devtable/settings-form';
import { Box } from '@mantine/core';
import { SettingsFormConfig } from '../../utils/config';
import { useLanguageContext } from '../../contexts';

export function DataSourcePage() {
  const { lang } = useLanguageContext();
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <DataSourceList config={SettingsFormConfig} lang={lang} />
    </Box>
  );
}
