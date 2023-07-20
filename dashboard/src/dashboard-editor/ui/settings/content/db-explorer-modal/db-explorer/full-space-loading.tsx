import { Box, LoadingOverlay } from '@mantine/core';

export const FullSpaceLoading = ({ visible }: { visible: boolean }) => {
  return (
    <Box py={10} sx={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <LoadingOverlay visible={visible} />
    </Box>
  );
};
