import { Stack, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { observer } from 'mobx-react-lite';
import { useEditPanelContext } from '~/contexts';

export const PreviewVariables = observer(() => {
  const { panel } = useEditPanelContext();

  if (Object.keys(panel.variableStrings).length === 0) {
    return null;
  }

  return (
    <Stack mt={22} spacing={4}>
      <Text size="sm" fw={500} color="dimmed">
        Variables
      </Text>
      <Prism language="json" colorScheme="dark" noCopy>
        {JSON.stringify(panel.variableStrings, null, 4)}
      </Prism>
    </Stack>
  );
});
