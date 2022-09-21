import { Text } from '@mantine/core';
import { IconArrowDown, IconArrowUp } from '@tabler/icons';
import { flexRender, Header } from '@tanstack/react-table';
import React from 'react';
import { AnyObject } from '~/types';

export const HeadCell = ({
  header,
  cx,
}: {
  header: Header<AnyObject, unknown>;
  cx: (...args: unknown[]) => string;
}) => {
  return (
    <Text
      className={cx('table-head-cell', { 'table-head-cell--sortable': header.column.getCanSort() })}
      onClick={header.column.getToggleSortingHandler()}
    >
      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
      {<SortIcon direction={header.column.getIsSorted()} />}
    </Text>
  );
};
const SortIcon = ({ direction }: { direction: false | 'asc' | 'desc' }) => {
  switch (direction) {
    case 'asc':
      return <IconArrowUp size={16} />;
    case 'desc':
      return <IconArrowDown size="1em" />;
    default:
      return null;
  }
};
