import { Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardContentChangelogDBType } from '../../../../api-caller/dashboard-content-changelog.types';
import { ReadonlyMonacoEditor } from '../../../../components/readonly-monaco-editor';
import { ErrorBoundary } from '../../../../utils/error-boundary';

interface IChangelogContent {
  current?: DashboardContentChangelogDBType;
  maxPage: number;
  loading: boolean;
}
export const ChangelogContent = observer(({ current, maxPage, loading }: IChangelogContent) => {
  if (maxPage === 0 && !loading) {
    return (
      <Text mt={20} c="red" size="md" ta="center" ff="monospace">
        Not found
      </Text>
    );
  }
  return (
    <Stack sx={{ position: 'relative', height: '100%' }}>
      <ErrorBoundary>
        {current && (
          <ReadonlyMonacoEditor
            language="git-diff-language"
            theme="git-diff-theme"
            value={current.diff}
            height="100%"
          />
        )}
      </ErrorBoundary>
    </Stack>
  );
});
