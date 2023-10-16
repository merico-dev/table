import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';
import { EditFilter } from './edit-filter';
import { EditFilters } from './edit-filters';
import { EditMockContext } from './edit-mock-context';
import { EditPanel } from './edit-panel';
import { EditQueries } from './edit-queries';
import { EditQuery } from './edit-query';
import { EditSQLSnippet } from './edit-sql-snippet';
import { EditSQLSnippets } from './edit-sql-snippets';
import { EditView } from './edit-view';
import {
  isFilter,
  isFilters,
  isMockContext,
  isPanel,
  isQueries,
  isQuery,
  isQueryVars,
  isSQLSnippet,
  isSQLSnippets,
  isView,
} from './utils';
import { ViewQueryVars } from './view-query-vars';

const Content = observer(() => {
  const editor = useEditDashboardContext().editor;
  const path = editor.path;
  if (isQueryVars(path)) {
    return <ViewQueryVars />;
  }
  if (isMockContext(path)) {
    return <EditMockContext />;
  }
  if (isFilters(path)) {
    return <EditFilters />;
  }
  if (isFilter(path)) {
    return (
      <Box p="xs" pl={20}>
        <EditFilter id={path[1]} />
      </Box>
    );
  }
  if (isSQLSnippets(path)) {
    return <EditSQLSnippets />;
  }
  if (isSQLSnippet(path)) {
    return <EditSQLSnippet id={path[1]} />;
  }
  if (isQueries(path)) {
    return <EditQueries />;
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
  return <Content />;
});
