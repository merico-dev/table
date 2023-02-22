import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { GlobalVariablesGuide } from './global-variables-guide';

export const ViewGlobalVars = observer(() => {
  return (
    <Stack sx={{ height: '100%' }} p="sm">
      <GlobalVariablesGuide />
    </Stack>
  );
});
