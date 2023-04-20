import { Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { DashboardChangelogDBType } from '../../../../api-caller/dashboard-changelog.types';
import { ReadonlyMonacoEditor } from '../../../../components/readonly-monaco-editor';
import { ErrorBoundary } from '../../../../utils/error-boundary';

interface IChangelogContent {
  current?: DashboardChangelogDBType;
  maxPage: number;
  loading: boolean;
}
export const ChangelogContent = observer(({ current, maxPage, loading }: IChangelogContent) => {
  if (maxPage === 0 && !loading) {
    return (
      <Text mt={20} color="red" size="md" align="center" sx={{ fontFamily: 'monospace' }}>
        Not found
      </Text>
    );
  }
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
});
