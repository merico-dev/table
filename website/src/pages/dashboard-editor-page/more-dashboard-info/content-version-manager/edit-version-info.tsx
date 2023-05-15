import { DashboardContentDBType } from '@devtable/dashboard';
import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ErrorBoundary } from '../../../../utils/error-boundary';

type TProps = Pick<DashboardContentDBType, 'id' | 'name' | 'create_time' | 'update_time'>;

export const EditVersionInfo = observer(({ id, name, create_time, update_time }: TProps) => {
  const submit = console.log;
  return (
    <Box sx={{ height: '100%', position: 'relative' }}>
      <ErrorBoundary>{name}</ErrorBoundary>
    </Box>
  );
});
