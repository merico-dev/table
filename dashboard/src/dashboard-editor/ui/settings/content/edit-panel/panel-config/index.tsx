import { Divider, Stack } from '@mantine/core';
import { EditDescription } from './description';
import { EditStyle } from './edit-style';
import { EditName } from './name';
import { EditTitle } from './title';
import { useTranslation } from 'react-i18next';

export function PanelConfig() {
  const { t } = useTranslation();
  return (
    <Stack sx={{ height: '100%' }}>
      <EditStyle />
      <Divider label={t('common.info')} labelPosition="center" variant="dashed" />
      <EditName />
      <EditTitle />
      <EditDescription />
    </Stack>
  );
}
