import { Sx } from '@mantine/core';

export const TableStyle: Sx = {
  width: 'fit-content',
  tableLayout: 'fixed',

  tr: {
    width: 'fit-content',
  },
  th: {
    position: 'relative',
  },

  '.resizer': {
    position: 'absolute',
    right: '0',
    top: '0',
    cursor: 'col-resize',
    userSelect: 'none',
    touchAction: 'none',
  },

  '.resizer.isResizing': {
    color: '#228be6',
    opacity: '1',
  },

  '@media (hover: hover)': {
    '.resizer': {
      opacity: '0',
    },

    '*:hover > .resizer': {
      color: '#228be6',
      opacity: '1',
    },
  },
};
