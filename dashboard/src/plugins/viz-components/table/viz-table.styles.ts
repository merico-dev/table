import { createStyles } from '@mantine/core';

export const useTableStyles = createStyles((theme) => ({
  root: {
    overflow: 'auto',
    '& .table-head-cell': {
      display: 'flex',
      flexFlow: 'row nowrap',
      alignItems: 'center',
      '&.table-head-cell--sortable': {
        cursor: 'pointer',
        userSelect: 'none',
      },
    },
  },
  thead: {
    background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    position: 'sticky',
    top: 0,
  },
}));
