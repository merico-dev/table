import { Group } from '@mantine/core';
import { GlobalVariablesGuide } from '../global-variables-guide';
import { MockContextEditor } from './editor';

export function EditMockContext() {
  return (
    <Group position="apart" grow align="stretch" noWrap>
      <MockContextEditor />
      <GlobalVariablesGuide showSQLSnippets={false} />
    </Group>
  );
}
