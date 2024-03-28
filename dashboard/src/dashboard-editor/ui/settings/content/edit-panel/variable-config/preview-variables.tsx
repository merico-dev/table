import { Stack, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useEditPanelContext } from '~/contexts';

export const PreviewVariables = observer(() => {
  const { t } = useTranslation();
  const { panel } = useEditPanelContext();

  if (Object.keys(panel.variableStrings).length === 0) {
    return null;
  }

  return (
    <Stack mt={22} spacing={4}>
      <Text size="sm" fw={500} color="dimmed">
        {t('panel.variable.labels')}
      </Text>
      <Prism language="json" colorScheme="dark" noCopy>
        {JSON.stringify(panel.variableStrings, null, 4)}
      </Prism>
    </Stack>
  );
});
