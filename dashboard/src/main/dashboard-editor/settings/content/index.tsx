import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { EditMockContext } from '~/definition-editor/mock-context-editor';
import { isMockContext } from './utils';

const Content = observer(() => {
  const editor = useModelContext().editor;
  const path = editor.path;
  if (isMockContext(path)) {
    return <EditMockContext />;
  }
  return <Box>{editor.path}</Box>;
});

export const SettingsContent = observer(() => {
  const editor = useModelContext().editor;
  return (
    <Box p="xs">
      <Content />
    </Box>
  );
});
