import { CodeHighlight } from '@mantine/code-highlight';
import { Box, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useEditDashboardContext } from '~/contexts';

export const QueryVariablesPreview = observer(() => {
  const model = useEditDashboardContext();

  return (
    <Stack
      styles={{
        root: {
          borderRadius: 4,
          backgroundColor: '#F9F9FA',
          height: '100%',
          minHeight: '350px',
          maxHeight: '50vh',
          overflow: 'hidden',
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
        code={model.queryVariablesString}
      />
    </Stack>
  );
});
