import { Divider, Text, Stack, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { useModelContext } from '~/contexts';
import { EViewComponentType } from '~/types';

export const ViewDivisionConfigFields = observer(() => {
  const model = useModelContext();
  const VIE = model.views.VIE;
  if (!VIE || VIE.type !== EViewComponentType.Division) {
    return null;
  }
  return (
    <Stack>
      <Divider mt={8} mb={0} label="Division settings" labelPosition="center" />
      <Text align="center" size="xs" color="dimmed">
        Under construction
      </Text>
    </Stack>
  );
});
