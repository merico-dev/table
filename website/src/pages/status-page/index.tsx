import { Box } from '@mantine/core';
import { StatusTable } from './table';

export function StatusPage() {
  return (
    <Box sx={{ maxWidth: 1200 }}>
      <StatusTable />
    </Box>
  );
}
