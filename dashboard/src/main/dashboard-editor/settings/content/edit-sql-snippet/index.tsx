import { Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useContentModelContext, useModelContext } from '~/contexts';
import { SQLSnippetItemEditor } from './item-editor';

export const EditSQLSnippet = observer(({ id }: { id: string }) => {
  const model = useModelContext();
  const content = useContentModelContext();
  const item = useMemo(() => content.sqlSnippets.findByKey(id), [id]);
  if (!id) {
    return null;
  }
  if (!item) {
    return <Text size={14}>SQL Snippet by key[{id}] is not found</Text>;
  }

  const resetEditorPath = () => {
    model.editor.setPath(['_SQL_SNIPPETS_', '']);
  };
  const remove = () => {
    content.sqlSnippets.removeByKey(id);
    resetEditorPath();
  };
  const updatePath = (key: string) => {
    model.editor.setPath(['_SQL_SNIPPETS_', key]);
  };
  return <SQLSnippetItemEditor item={item} remove={remove} onKeyChanged={updatePath} />;
});
