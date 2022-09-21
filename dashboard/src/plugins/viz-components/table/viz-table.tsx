import { Table, TableProps } from '@mantine/core';
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
import { get } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { useVirtual } from 'react-virtual';
import { useCurrentInteractionManager } from '~/interactions/hooks/use-current-interaction-manager';
import { useTriggerSnapshotList } from '~/interactions/hooks/use-watch-triggers';
import { HeadCell } from '~/plugins/viz-components/table/components/head-cell';
import { ClickCellContent, IClickCellContentConfig } from '~/plugins/viz-components/table/triggers/click-cell-content';
import { useTableStyles } from '~/plugins/viz-components/table/viz-table.styles';
import { AnyObject } from '~/types';
import { ITriggerSnapshot, IVizInteractionManager, VizInstance, VizViewProps } from '~/types/plugin';
import { IVizManager, useStorageData } from '../..';
import { DEFAULT_CONFIG, IColumnConf, ITableCellContext, ITableConf, ValueType } from './type';
import { CellValue } from './value';

type TriggerConfigType = IClickCellContentConfig;

const useGetCellContext = (context: {
  vizManager: IVizManager;
  instance: VizInstance;
  getColIndex: (cell: Cell<AnyObject, unknown>) => number;
}) => {
  const interactionManager = useCurrentInteractionManager(context);
  const triggers = useTriggerSnapshotList<TriggerConfigType>(interactionManager.triggerManager, ClickCellContent.id);
  return useCallback(
    (cell: Cell<AnyObject, unknown>) => new TableCellContext(context.getColIndex, cell, triggers, interactionManager),
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
          <CellValue tableCellContext={getCellContext(cell.cell)} value={cell.getValue()} type={c.value_type} />
        ),
        header: c.label,
        enableSorting: true,
        meta: c,
      });
    });
    const indexCol = columnHelper.display({
      id: '#index',
      cell: (ctx) => ctx.row.index + 1,
      header: '#',
      size: 10 * (data.length.toString().length + 1),
    });
    return [indexCol, ...valueCols];
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

  return (
    <div ref={tableContainerRef} style={{ height, width }} className={classes.root}>
      <Table sx={{ maxHeight: height }} {...(rest as TableProps)}>
        <thead className={classes.thead}>
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

class TableCellContext implements ITableCellContext {
  constructor(
    private getColIndex: (cell: Cell<AnyObject, unknown>) => number,
    public cell: Cell<AnyObject, unknown>,
    public triggers: ITriggerSnapshot<TriggerConfigType>[],
    public interactionManager: IVizInteractionManager,
  ) {}

  getClickHandler(): (() => void) | undefined {
    const relatedTriggers = this.getRelatedTrigger();
    if (relatedTriggers.length === 0) {
      return undefined;
    }
    return () => {
      const payload = {
        row_data: this.cell.row.original,
        row_index: this.cell.row.index,
        col_index: this.getColIndex(this.cell),
      };
      for (const trigger of relatedTriggers) {
        void this.interactionManager.runInteraction(trigger.id, payload);
      }
    };
  }

  private getRelatedTrigger() {
    const clickCellTriggers = this.triggers.filter((it) => it.schemaRef === ClickCellContent.id);
    return clickCellTriggers.filter((it) => {
      // -1 for index column
      const colIndex = this.getColIndex(this.cell);
      const colField = get(this.cell.column.columnDef.meta, 'value_field');
      const column = get(it.config, 'column');
      return column == colIndex || column == colField;
    });
  }

  isClickable(): boolean {
    return this.getRelatedTrigger().length > 0;
  }
}
