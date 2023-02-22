import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { EditMockContext } from '~/definition-editor/mock-context-editor';
import { EditFilter } from './edit-filter';
import { EditPanel } from './edit-panel';
import { EditQuery } from './edit-query';
import { EditSQLSnippet } from './edit-sql-snippet';
import { EditView } from './edit-view';
import { isMockContext, isFilter, isSQLSnippet, isQuery, isView, isPanel } from './utils';

const Content = observer(() => {
  const editor = useModelContext().editor;
  const path = editor.path;
  if (isMockContext(path)) {
    return (
      <Box p="xs" pl={20}>
        <EditMockContext />;
      </Box>
    );
  }
  if (isFilter(path)) {
    return (
      <Box p="xs" pl={20}>
        <EditFilter id={path[1]} />
      </Box>
    );
  }
  if (isSQLSnippet(path)) {
    return (
      <Box p="xs" pl={20}>
        <EditSQLSnippet id={path[1]} />
      </Box>
    );
  }
  if (isQuery(path)) {
    return <EditQuery id={path[1]} />;
  }
  if (isView(path)) {
    return (
      <Box p="xs" pl={20}>
        <EditView id={path[1]} />
      </Box>
    );
  }
  if (isPanel(path)) {
    return <EditPanel viewID={path[1]} panelID={path[3]} />;
  }
  return <Box>{editor.path}</Box>;
});

export const SettingsContent = observer(() => {
  const editor = useModelContext().editor;
  return <Content />;
});
