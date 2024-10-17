import { ActionIcon, Box, Table, TableProps, Text } from '@mantine/core';
import {
  SortingState,
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
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
import { CellValue } from './cell-value';
import { TableBody } from './table-body';
import { useGetCellContext } from './use-get-cell-context';
import { IconArrowBarToRight } from '@tabler/icons-react';

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
        cell: (cell) => {
          return (
            <CellValue
              tableCellContext={getCellContext(cell.cell)}
              value={cell.getValue()}
              type={c.value_type}
              row_data={cell.row.original}
              {...c}
            />
          );
        },
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
    columnResizeMode: 'onChange',
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      {totalRows > 0 && (
        <Box className={classes.info_bar} sx={{ height: 22 }}>
          <Text ta="right" pr={6} size={'14px'} c="dimmed" fw="normal">
            {t('common.pagination.total_rows', { total: totalRows })}
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
                    <ActionIcon
                      variant="subtle"
                      onMouseDown={header.getResizeHandler()}
                      onTouchStart={header.getResizeHandler()}
                      className={`resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                    >
                      <IconArrowBarToRight />
                    </ActionIcon>
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
