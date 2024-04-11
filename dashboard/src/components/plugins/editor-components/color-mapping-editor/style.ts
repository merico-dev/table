import { createStyles } from '@mantine/core';

export const useStyles = createStyles(() => ({
  palette: {
    display: 'flex',
    flexFlow: 'row nowrap',
  },
  paletteItem: {
    '.palette-value': {
      height: 24,
      overflow: 'visible',
      width: 36,
    },
    '.palette-item': {
      width: '36px',
      height: 36 * 0.618,
      cursor: 'pointer',
      transition: 'transform 100ms ease-in-out',
      '&:hover': {
        boxShadow: '0 0 0 2px var(--shadow-color)',
        borderRadius: 2,
        transform: 'scale(1.2)',
      },
    },
  },
}));

export type StylesType = ReturnType<typeof useStyles>;
