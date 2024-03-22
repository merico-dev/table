import { Divider, Stack, Text } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { EViewComponentType, ViewMetaInstance } from '~/model';

export const ViewDivisionConfigFields = observer(({ view }: { view: ViewMetaInstance }) => {
  if (!view || view.type !== EViewComponentType.Division) {
    return null;
  }
  return (
    <Stack>
      {/* <Divider mt={8} mb={0} label="Division settings" labelPosition="center" />
      <Text align="center" size="xs" color="dimmed">
        Under construction
      </Text> */}
    </Stack>
  );
});
