import { createStyles } from '@mantine/core';

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
  },
}));
