import { ActionIcon, Table, TableProps } from '@mantine/core';
import { get } from 'lodash';
import { IconArrowBarToRight } from '@tabler/icons-react';
import {
  createColumnHelper,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HeadCell } from '~/components/plugins/viz-components/table/components/head-cell';
import { baseTableSX, useTableStyles } from '~/components/plugins/viz-components/table/viz-table.styles';
import { AnyObject } from '~/types';
import { VizInstance, VizViewContext } from '~/types/plugin';
import { parseDataKeyOrColumnKey } from '~/utils';
import { IColumnConf, ITableConf, ValueType } from '../type';
import { PaginationOrRowCount } from './pagination-and-row-count';
import { TableBody } from './table-body';
import { useCellRenderer } from './use-cell-renderer';
import { useGetCellContext } from './use-get-cell-context';

type IVizTableComponent = {
  queryData: TQueryData;
  width: number;
  height: number;
  conf: ITableConf;
  instance: VizInstance;
  context: VizViewContext;
};

export function VizTableComponent({ queryData, width, height, conf, context, instance }: IVizTableComponent) {
  const { t } = useTranslation();
  const { use_raw_columns, ignored_column_keys, columns, ...rest } = conf;

  const { classes, cx } = useTableStyles();

  const finalColumns: IColumnConf[] = React.useMemo(() => {
    if (!use_raw_columns) {
      return columns;
    }

    if (!Array.isArray(queryData) || queryData.length === 0) {
      return [];
    }

    let keys = Object.keys(queryData[0]);
    const ignoredKeys = new Set(ignored_column_keys?.split(/\r?\n|\r|\n/g).filter((t) => !!t));
    if (ignoredKeys.size > 0) {
      keys = keys.filter((k) => !ignoredKeys.has(k));
    }
    return keys.map((k) => ({
      id: k,
      label: k,
      value_field: k,
      value_type: ValueType.string,
      align: 'left',
      width: '',
      cellBackgroundColor: '',
    }));
  }, [use_raw_columns, ignored_column_keys, columns, queryData]);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: conf.pagination.page_size,
  });

  const getCellContext = useGetCellContext({
    getColIndex: useCallback((cell) => finalColumns.indexOf(cell.column.columnDef.meta as IColumnConf), [finalColumns]),
    vizManager: context.vizManager,
    instance: instance,
  });

  const { createCellRenderer } = useCellRenderer({
    conf,
    getCellContext,
  });

  const tableColumns = useMemo(() => {
    const columnHelper = createColumnHelper<AnyObject>();

    return finalColumns.map((c, index) => {
      const k = parseDataKeyOrColumnKey(c.value_field);
      return columnHelper.accessor(k.columnKey, {
        cell: createCellRenderer(c, index === 0),
        header: c.label,
        enableSorting: true,
        meta: c,
        size: typeof c.width === 'number' ? c.width : undefined,
        minSize: typeof c.width === 'number' ? c.width : undefined,
      });
    });
  }, [finalColumns, createCellRenderer]);

  const data = useMemo(() => {
    const { pageIndex, pageSize } = pagination;
    if (pageSize === 0) {
      return queryData;
    }
    return queryData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  }, [queryData, pagination]);

  const pageCount = Math.ceil(queryData.length / pagination.pageSize);
  const table = useReactTable<AnyObject>({
    data,
    columns: tableColumns,
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: conf.sub_rows_column_key ? (row) => get(row, conf.sub_rows_column_key!) : undefined,
  });
  const { rows } = table.getRowModel();
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const totalRows = rows.length;
  const showInfoBar = totalRows > 0;
  const tableHeight = showInfoBar ? height - 22 : height;
  const theadTop = showInfoBar ? 22 : 0;

  return (
    <div
      ref={tableContainerRef}
      style={{ height, width, padding: '0 5px' }}
      data-enable-scrollbar
      className={cx(classes.root, { 'table-highlight-on-hover': conf.highlightOnHover })}
    >
      <PaginationOrRowCount
        classes={classes}
        pagination={pagination}
        totalRows={totalRows}
        setPagination={setPagination}
        pageCount={pageCount}
      />
      <Table sx={{ ...baseTableSX, maxHeight: tableHeight }} {...(rest as TableProps)} striped={conf.striped}>
        <Table.Thead className={classes.thead} style={{ top: theadTop }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Table.Th key={header.id} style={{ width: header.getSize() }}>
                    <HeadCell header={header} cx={cx} />
                    <ActionIcon
                      variant="subtle"
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                    >
                      <IconArrowBarToRight />
                    </ActionIcon>
                  </Table.Th>
                );
              })}
            </Table.Tr>
          ))}
        </Table.Thead>
        <TableBody tableContainerRef={tableContainerRef} rows={rows} />
      </Table>
    </div>
  );
}
