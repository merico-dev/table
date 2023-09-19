import { Box, Table, TableProps, Text } from '@mantine/core';
import {
  SortingState,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useWhyDidYouUpdate } from 'ahooks';
import React, { useCallback, useMemo, useState } from 'react';
import { HeadCell } from '~/components/plugins/viz-components/table/components/head-cell';
import { baseTableSX, useTableStyles } from '~/components/plugins/viz-components/table/viz-table.styles';
import { AnyObject } from '~/types';
import { VizInstance, VizViewContext } from '~/types/plugin';
import { parseDataKeyOrColumnKey } from '~/utils/data';
import { IColumnConf, ITableConf, ValueType } from '../type';
import { CellValue } from './cell-value';
import { TableBody } from './table-body';
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
  const { id_field, use_raw_columns, columns, ...rest } = conf;

  const { classes, cx } = useTableStyles();

  const finalColumns: IColumnConf[] = React.useMemo(() => {
    if (use_raw_columns) {
      if (!Array.isArray(queryData) || queryData.length === 0) {
        return [];
      }
      return Object.keys(queryData[0]).map((k) => ({
        id: k,
        label: k,
        value_field: k,
        value_type: ValueType.string,
        align: 'left',
        width: '',
        cellBackgroundColor: '',
      }));
    }
    return columns;
  }, [use_raw_columns, columns, queryData]);

  const getCellContext = useGetCellContext({
    getColIndex: useCallback((cell) => finalColumns.indexOf(cell.column.columnDef.meta as IColumnConf), [finalColumns]),
    vizManager: context.vizManager,
    instance: instance,
  });

  const tableColumns = useMemo(() => {
    const columnHelper = createColumnHelper<AnyObject>();
    const valueCols = finalColumns.map((c) => {
      const k = parseDataKeyOrColumnKey(c.value_field);
      return columnHelper.accessor(k.columnKey, {
        cell: (cell) => (
          <CellValue tableCellContext={getCellContext(cell.cell)} value={cell.getValue()} type={c.value_type} {...c} />
        ),
        header: c.label,
        enableSorting: true,
        meta: c,
        size: typeof c.width === 'number' ? c.width : undefined,
        minSize: typeof c.width === 'number' ? c.width : undefined,
      });
    });
    return valueCols;
  }, [finalColumns, getCellContext]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable<AnyObject>({
    data: queryData,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const { rows } = table.getRowModel();
  const tableContainerRef = React.useRef<HTMLDivElement>(null);

  const totalRows = rows.length;
  const showInfoBar = totalRows > 0;
  const tableHeight = showInfoBar ? height - 22 : height;
  const theadTop = showInfoBar ? 22 : 0;

  useWhyDidYouUpdate('VizTableComponent', {
    queryData,
    width,
    height,
    conf,
    context,
    instance,
    finalColumns,
    getCellContext,
    tableColumns,
    table,
    rows,
    tableContainerRef,
  });
  return (
    <div
      ref={tableContainerRef}
      style={{ height, width, padding: '0 5px' }}
      data-enable-scrollbar
      className={cx(classes.root, { 'table-highlight-on-hover': conf.highlightOnHover })}
    >
      {totalRows > 0 && (
        <Box className={classes.info_bar} sx={{ height: 22 }}>
          <Text align="right" pr={6} size={14} color="dimmed" fw="normal">
            Total: {totalRows}
          </Text>
        </Box>
      )}
      <Table sx={{ ...baseTableSX, maxHeight: tableHeight }} {...(rest as TableProps)} striped={conf.striped}>
        <thead className={classes.thead} style={{ top: theadTop }}>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} style={{ width: header.getSize() }}>
                    <HeadCell header={header} cx={cx} />
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <TableBody tableContainerRef={tableContainerRef} rows={rows} />
      </Table>
    </div>
  );
}
