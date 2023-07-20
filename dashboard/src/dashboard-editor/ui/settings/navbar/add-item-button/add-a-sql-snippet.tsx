import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { SQLSnippetModelInstance } from '~/dashboard-editor/model';

export const AddASQLSnippet = observer(() => {
  const model = useModelContext();
  const add = () => {
    const id = new Date().getTime().toString();
    const v = {
      key: id,
      value: '',
    } as SQLSnippetModelInstance;
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
      Add a SQL Snippet
    </Button>
  );
});
