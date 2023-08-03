import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
  root: {
    height: '100%',
    overflow: 'hidden',
    '.var-list-container': {
      '& > *': {
        height: '100%',
      },
      width: 250,
      height: '100%',
    },
    '.var-list-actions': {
      height: 'fit-content',
      flexShrink: 0,
      width: '100%',
    },
    '.var-list': {
      flex: '1 1 auto',
      overflow: 'auto',
      minHeight: 0,
      '& > *': {
        flex: '0 0 auto',
      },
    },
  },
  config: {
    height: '100%',
    overflow: 'auto',
    paddingRight: 10,
  },
}));
