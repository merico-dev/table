import { Box } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import { ReactNode } from 'react';

export const PreviewViewDivision = observer(({ children }: { children: ReactNode }) => {
  return (
    <Box pt={10} pb={100}>
      {children}
    </Box>
  );
});
