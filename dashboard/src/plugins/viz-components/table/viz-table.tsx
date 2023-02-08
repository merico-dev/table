import { Box, Table, TableProps, Text } from '@mantine/core';
import {
  Cell,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { useVirtual } from 'react-virtual';
import { useCurrentInteractionManager } from '~/interactions/hooks/use-current-interaction-manager';
import { useTriggerSnapshotList } from '~/interactions/hooks/use-watch-triggers';
import { HeadCell } from '~/plugins/viz-components/table/components/head-cell';
import { ClickCellContent } from '~/plugins/viz-components/table/triggers/click-cell-content';
import { baseTableSX, useTableStyles } from '~/plugins/viz-components/table/viz-table.styles';
import { AnyObject } from '~/types';
import { VizInstance, VizViewProps } from '~/types/plugin';
import { IVizManager, PluginContext, useStorageData } from '../..';
import { TableCellContext } from './table-cell-context';
import { DEFAULT_CONFIG, IColumnConf, ITableConf, TriggerConfigType, ValueType } from './type';
import { CellValue } from './value';

const useGetCellContext = (context: {
  vizManager: IVizManager;
  instance: VizInstance;
  getColIndex: (cell: Cell<AnyObject, unknown>) => number;
}) => {
  const interactionManager = useCurrentInteractionManager(context);
  const triggers = useTriggerSnapshotList<TriggerConfigType>(interactionManager.triggerManager, ClickCellContent.id);
  const { colorManager } = useContext(PluginContext);
  return useCallback(
    (cell: Cell<AnyObject, unknown>) =>
      new TableCellContext(context.getColIndex, cell, triggers, interactionManager, colorManager),
    [triggers, interactionManager, context.getColIndex],
  );
};

export function VizTable({ context, instance }: VizViewProps) {
  const data = (context.data ?? []) as AnyObject[];
  const { height, width } = context.viewport;
  const { value: conf = DEFAULT_CONFIG } = useStorageData<ITableConf>(context.instanceData, 'config');
  const { use_raw_columns, columns, ...rest } = conf;

  const { classes, cx } = useTableStyles();

  const finalColumns: IColumnConf[] = React.useMemo(() => {
    if (use_raw_columns) {
      return Object.keys(data[0]).map((k) => ({
        id: k,
        label: k,
        value_field: k,
        value_type: ValueType.string,
      }));
    }
    return columns;
  }, [use_raw_columns, columns, data]);
  const getCellContext = useGetCellContext({
    getColIndex: useCallback((cell) => finalColumns.indexOf(cell.column.columnDef.meta as IColumnConf), [finalColumns]),
    vizManager: context.vizManager,
    instance: instance,
  });

  const tableColumns = useMemo(() => {
    const columnHelper = createColumnHelper<AnyObject>();
    const valueCols = finalColumns.map((c) => {
      return columnHelper.accessor(c.value_field, {
        cell: (cell) => (
          <CellValue
            tableCellContext={getCellContext(cell.cell)}
            value={cell.getValue()}
            type={c.value_type}
            func_content={c.func_content}
          />
        ),
        header: c.label,
        enableSorting: true,
        meta: c,
        size: c.width,
        minSize: c.width,
      });
    });
    return valueCols;
  }, [finalColumns, getCellContext]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    data,
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

  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    estimateSize: useCallback(() => 28, []),
    overscan: 20,
  });
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer;

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0;
  const paddingBottom = virtualRows.length > 0 ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0;

  const totalRows = rows.length;
  const showInfoBar = totalRows > 0;
  const tableHeight = showInfoBar ? height - 22 : height;
  const theadTop = showInfoBar ? 22 : 0;
  return (
    <div
      ref={tableContainerRef}
      style={{ height, width }}
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
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ width: header.getSize() }}>
                  <HeadCell header={header} cx={cx} />
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: `${paddingTop}px` }} />
            </tr>
          )}
          {virtualRows.map((virtualRow) => {
            const row = rows[virtualRow.index] as Row<AnyObject>;
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            );
          })}
          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: `${paddingBottom}px` }} />
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
