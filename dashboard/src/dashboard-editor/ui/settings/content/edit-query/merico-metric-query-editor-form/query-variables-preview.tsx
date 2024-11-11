import { CodeHighlight } from '@mantine/code-highlight';
import { Box, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEditContentModelContext, useEditDashboardContext } from '~/contexts';

export const QueryVariablesPreview = observer(() => {
  const model = useEditDashboardContext();
  const content = useEditContentModelContext();
  const contextInfo = model.context.current;

  const variablesString = (() => {
    const ret: Record<string, $TSFixMe> = {
      context: {
        ...content.mock_context.current,
        ...contextInfo,
      },
      filters: content.filters.previewValues,
    };

    return JSON.stringify(ret, null, 2);
  })();

  return (
    <Stack
      styles={{
        root: {
          borderRadius: 4,
          backgroundColor: '#F9F9FA',
        },
      }}
    >
      <Box py={7} px={8}>
        <Text fw="bold" size="sm">
          看板变量预览
        </Text>
      </Box>
      <CodeHighlight
        language="json"
        sx={{ width: '100%', height: '100%', minHeight: '400px', overflowY: 'auto' }}
        withCopyButton={false}
        code={variablesString}
      />
    </Stack>
  );
});
