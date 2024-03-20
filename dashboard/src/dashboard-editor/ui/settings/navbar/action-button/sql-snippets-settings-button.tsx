import { Button } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';

export const SQLSnippetsSettingsButton = observer(() => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  return (
    <Button
      variant="subtle"
      rightIcon={<IconSettings size={14} />}
      size="sm"
      px={12}
      mb={0}
      color="blue"
      onClick={() => model.editor.setPath(['_SQL_SNIPPETS_'])}
      sx={{ width: '100%', borderRadius: 0, fontWeight: 'normal' }}
      styles={{
        inner: {
          justifyContent: 'space-between',
        },
      }}
    >
      {t('sql_snippet.manage')}
    </Button>
  );
});
