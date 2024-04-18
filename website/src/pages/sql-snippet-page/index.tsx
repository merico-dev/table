import { SQLSnippetList } from '@devtable/settings-form';
import { Box } from '@mantine/core';
import { SettingsFormConfig } from '../../utils/config';
import { useLanguageContext } from '../../contexts';

export function SQLSnippetPage() {
  const { lang } = useLanguageContext();
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <SQLSnippetList config={SettingsFormConfig} lang={lang} />
    </Box>
  );
}
