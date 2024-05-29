import { createStyles, Sx } from '@mantine/core';

export const useTableStyles = createStyles((theme) => ({
  root: {
    overflow: 'auto',
    position: 'relative',
    '& .table-head-cell': {
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      whiteSpace: 'nowrap',
      '&.table-head-cell--sortable': {
        cursor: 'pointer',
        userSelect: 'none',
      },
    },
    '&.table-highlight-on-hover tr': {
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
      },
    },
  },
  thead: {
    background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    position: 'sticky',
    top: 24,
    transform: 'translateY(-1px)',
    zIndex: 10,
  },
  info_bar: {
    position: 'sticky',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    background: 'white',
  },
}));

export const baseTableSX: Sx = {
  tableLayout: 'fixed',
  width: 'fit-content',
  minWidth: '100%',
  'thead, tbody': {
    tr: {
      width: 'fit-content',
      th: {
        position: 'relative',
      },
      'th, td': {
        padding: '2px 10px',
        // wordBreak: 'break-word',
        div: {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        // for index column
        '&:first-of-type': {
          paddingLeft: 2,
          paddingRight: 2,
        },
      },
    },
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
    transform: 'translateY(-50%)',
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
