import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { EditMockContext } from '~/definition-editor/mock-context-editor';
import { EditFilter } from './edit-filter';
import { EditSQLSnippet } from './edit-sql-snippet';
import { isMockContext, isFilter, isSQLSnippet } from './utils';

const Content = observer(() => {
  const editor = useModelContext().editor;
  const path = editor.path;
  if (isMockContext(path)) {
    return <EditMockContext />;
  }
  if (isFilter(path)) {
    return <EditFilter id={path[1]} />;
  }
  if (isSQLSnippet(path)) {
    return <EditSQLSnippet id={path[1]} />;
  }
  return <Box>{editor.path}</Box>;
});

export const SettingsContent = observer(() => {
  const editor = useModelContext().editor;
  return (
    <Box p="xs" pl={20}>
      <Content />
    </Box>
  );
});
