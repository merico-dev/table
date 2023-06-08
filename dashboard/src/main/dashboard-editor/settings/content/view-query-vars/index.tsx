import { Stack } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { QueryVariablesGuide } from './query-variables-guide';

export const ViewGlobalVars = observer(() => {
  return (
    <Stack sx={{ height: '100%' }} p="sm">
      <QueryVariablesGuide />
    </Stack>
  );
});
