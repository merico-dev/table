import { Text } from '@mantine/core';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useModelContext } from '~/contexts';
import { SQLSnippetItemEditor } from '~/definition-editor/sql-snippet-editor/item-editor';

export const EditSQLSnippet = observer(({ id }: { id: string }) => {
  const model = useModelContext();
  const item = useMemo(() => model.sqlSnippets.findByKey(id), [id]);
  if (!item) {
    return <Text size={14}>SQL Snippet by key[{id}] is not found</Text>;
  }
  const remove = () => model.sqlSnippets.removeByKey(id);
  const updatePath = (key: string) => {
    model.editor.setPath(['_SQL_SNIPPETS_', key]);
  };
  return <SQLSnippetItemEditor item={item} remove={remove} onKeyChanged={updatePath} />;
});
