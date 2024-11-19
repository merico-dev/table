import { EmotionSx } from '@mantine/emotion';

export const TableStyle: EmotionSx = {
  width: 'fit-content',
  minWidth: '100%',
  tableLayout: 'fixed',

  tr: {
    width: 'fit-content',
  },
  th: {
    position: 'relative',
  },
  'th, td': {
    wordBreak: 'break-word',
  },

  '.resizer': {
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'col-resize',
    userSelect: 'none',
    touchAction: 'none',
  },

  '.resizer.isResizing': {
    color: '#228be6',
    opacity: '1',
    backgroundColor: 'rgb(248, 249, 250)',
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
