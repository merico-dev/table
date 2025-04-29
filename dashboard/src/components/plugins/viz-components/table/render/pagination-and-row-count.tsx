import { ActionIcon, Box, Group, Pagination, Text } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useTableStyles } from '../viz-table.styles';
import { PaginationState } from '@tanstack/react-table';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

type Props = {
  classes: ReturnType<typeof useTableStyles>['classes'];
  pagination: PaginationState;
  setPagination: (pagination: PaginationState) => void;
  totalRows: number;
  pageCount: number;
};
export const PaginationOrRowCount = ({ classes, pagination, setPagination, pageCount, totalRows }: Props) => {
  const { t } = useTranslation();
  const { pageSize, pageIndex } = pagination;

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

  const prevPage = () => {
    setPagination({ ...pagination, pageIndex: pageIndex - 1 });
  };
  const nextPage = () => {
    setPagination({ ...pagination, pageIndex: pageIndex + 1 });
  };

  return (
    <Group wrap="nowrap" justify="flex-end" gap={4} className={classes.info_bar} sx={{ height: 22 }}>
      <Text ta="right" pr={6} size={'14px'} c="dimmed" fw="normal">
        {t('common.pagination.showing_rows', {
          start_row: pageIndex * pageSize + 1,
          end_row: (pageIndex + 1) * pageSize,
          total: totalRows,
        })}
      </Text>
      <ActionIcon
        variant="default"
        aria-label="to previous page"
        onClick={prevPage}
        size="xs"
        disabled={pageIndex === 0}
      >
        <IconChevronLeft />
      </ActionIcon>
      <ActionIcon
        variant="default"
        aria-label="to next page"
        onClick={nextPage}
        size="xs"
        disabled={pageIndex === pageCount - 1}
      >
        <IconChevronRight />
      </ActionIcon>
    </Group>
  );
};
