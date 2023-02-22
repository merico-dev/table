import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { EditFilter } from './edit-filter';
import { EditMockContext } from './edit-mock-context';
import { EditPanel } from './edit-panel';
import { EditQuery } from './edit-query';
import { EditSQLSnippet } from './edit-sql-snippet';
import { EditView } from './edit-view';
import { isGlobalVars, isMockContext, isFilter, isSQLSnippet, isQuery, isView, isPanel } from './utils';
import { ViewGlobalVars } from './view-global-vars';

const Content = observer(() => {
  const editor = useModelContext().editor;
  const path = editor.path;
  if (isGlobalVars(path)) {
    return <ViewGlobalVars />;
  }
  if (isMockContext(path)) {
    return <EditMockContext />;
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
