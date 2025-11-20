import { ActionIcon, Box, Group, Text } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { AnyObject } from '~/types';
import { useTableStyles } from '../viz-table.styles';

type Props = {
  classes: ReturnType<typeof useTableStyles>['classes'];
  table: Table<AnyObject>;
  pageSize: number;
};

export const PaginationOrRowCount = ({ classes, table, pageSize }: Props) => {
  const { t } = useTranslation();
  const totalRows = table.getPrePaginationRowModel().rows.length;

  if (totalRows === 0) {
    return null;
  }

  if (pageSize === 0) {
    return (
      <Box className={classes.info_bar} sx={{ height: 22 }}>
        <Text ta="right" pr={6} size={'14px'} c="dimmed" fw="normal">
          {t('common.pagination.total_rows', { total: totalRows })}
        </Text>
      </Box>
    );
  }

  const pageIndex = table.getState().pagination.pageIndex;

  return (
    <Group wrap="nowrap" justify="flex-end" gap={4} className={classes.info_bar} sx={{ height: 22 }}>
      <Text ta="right" pr={6} size={'14px'} c="dimmed" fw="normal">
        {t('common.pagination.showing_rows', {
          start_row: pageIndex * pageSize + 1,
          end_row: Math.min((pageIndex + 1) * pageSize, totalRows),
          total: totalRows,
        })}
      </Text>
      <ActionIcon
        variant="default"
        aria-label="to previous page"
        onClick={() => table.previousPage()}
        size="xs"
        disabled={!table.getCanPreviousPage()}
      >
        <IconChevronLeft />
      </ActionIcon>
      <ActionIcon
        variant="default"
        aria-label="to next page"
        onClick={() => table.nextPage()}
        size="xs"
        disabled={!table.getCanNextPage()}
      >
        <IconChevronRight />
      </ActionIcon>
    </Group>
  );
};
