import { Box, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardChangelogDBType } from '../../../../api-caller/dashboard-changelog.types';
import { ReadonlyMonacoEditor } from '../../../../components/readonly-monaco-editor';
import { ErrorBoundary } from '../../../../utils/error-boundary';

interface IChangelogContent {
  current?: DashboardChangelogDBType;
  maxPage: number;
}
export const ChangelogContent = observer(({ current, maxPage }: IChangelogContent) => {
  if (maxPage === 0) {
    return (
      <Text mt={20} color="red" size="md" align="center" sx={{ fontFamily: 'monospace' }}>
        This table is empty
      </Text>
    );
  }
  return (
    <ErrorBoundary>
      <Box p={0} sx={{ width: '100%', height: '100%', overflow: 'auto', position: 'relative' }}>
        <Stack sx={{ position: 'relative', height: '100%' }}>
          {current && (
            <ReadonlyMonacoEditor
              language="git-diff-language"
              theme="git-diff-theme"
              value={current.diff}
              height="100%"
            />
          )}
        </Stack>
      </Box>
    </ErrorBoundary>
  );
});
