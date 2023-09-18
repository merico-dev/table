import { Box } from '@mantine/core';
import { ReactNode } from 'react';

export const paddings = {
  top: 16,
  right: 16,
  bottom: 16,
  left: 16,
};

export const getBoxContentWidth = (width: number) => {
  return Math.max(0, width - paddings.left - paddings.right);
};
export const getBoxContentHeight = (height: number) => {
  return Math.max(0, height - paddings.top - paddings.bottom);
};
export const getBoxContentStyle = (width: number, height: number) => {
  return {
    width: getBoxContentWidth(width),
    height: getBoxContentHeight(height),
  };
};
export const DefaultVizBox = ({ width, height, children }: { width: number; height: number; children: ReactNode }) => {
  return (
    <Box
      pt={paddings.top}
      pr={paddings.right}
      pb={paddings.bottom}
      pl={paddings.left}
      sx={{ width, height, overflow: 'hidden', position: 'relative' }}
    >
      {children}
    </Box>
  );
};
