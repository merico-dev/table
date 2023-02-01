import { createStyles, Sx } from '@mantine/core';

export const useTableStyles = createStyles((theme) => ({
  root: {
    overflow: 'auto',
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
    top: 0,
    transform: 'translateY(-1px)',
    zIndex: 10,
    'th, td': {
      padding: 0,
      background: 'white',
    },
  },
  thead_background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'white',
    zIndex: -1,
  },
}));

export const baseTableSX: Sx = {
  tableLayout: 'fixed',
  'th, td': {
    padding: '2px 10px',
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
};
