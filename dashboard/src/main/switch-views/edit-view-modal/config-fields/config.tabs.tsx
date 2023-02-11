import { Divider, Text, Stack, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { EViewComponentType } from '~/types';

export const ViewTabsConfigFields = observer(() => {
  const model = useModelContext();
  const VIE = model.views.VIE;
  if (!VIE || VIE.type !== EViewComponentType.Tabs) {
    return null;
  }
  return (
    <Stack>
      <Divider mt={8} mb={0} label="Tabs settings" labelPosition="center" />
      <Text align="center" size="xs" color="dimmed">
        Under construction
      </Text>
    </Stack>
  );
});
