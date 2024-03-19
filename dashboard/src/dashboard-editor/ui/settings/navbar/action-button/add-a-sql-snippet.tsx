import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditDashboardContext } from '~/contexts';
import { SQLSnippetRenderModelSnapshotIn } from '~/model';

export const AddASQLSnippet = observer(() => {
  const { t } = useTranslation();
  const model = useEditDashboardContext();
  const add = () => {
    const id = new Date().getTime().toString();
    const v: SQLSnippetRenderModelSnapshotIn = {
      key: id,
      value: '',
    };
    model.content.sqlSnippets.append(v);
    model.editor.setPath(['_SQL_SNIPPETS_', id]);
  };

  return (
    <Button
      variant="subtle"
      leftIcon={<IconPlus size={14} />}
      size="sm"
      px="xs"
      mb={10}
      color="blue"
      onClick={add}
      sx={{ width: '100%', borderRadius: 0 }}
      styles={{
        inner: {
          justifyContent: 'flex-start',
        },
      }}
    >
      {t('Add a SQL Snippet')}
    </Button>
  );
});
