import { Table, TableProps, Text } from '@mantine/core';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Header,
  Row,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { get } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { IconArrowUp, IconArrowDown } from '@tabler/icons';
import { useVirtual } from 'react-virtual';
import { useCurrentInteractionManager } from '~/interactions/hooks/use-current-interaction-manager';
import { useTriggerSnapshotList } from '~/interactions/hooks/use-watch-triggers';
import { ClickCellContent, IClickCellContentConfig } from '~/plugins/viz-components/table/triggers/click-cell-content';
import { useTableStyles } from '~/plugins/viz-components/table/viz-table.styles';
import { AnyObject } from '~/types';
import { VizInstance, VizViewProps } from '~/types/plugin';
import { IVizManager, useStorageData } from '../..';
import { DEFAULT_CONFIG, IColumnConf, ITableConf, ValueType } from './type';
import { CellValue } from './value';

type TriggerConfigType = IClickCellContentConfig;

const useHandleContentClick = (context: { vizManager: IVizManager; instance: VizInstance }) => {
  const interactionManager = useCurrentInteractionManager(context);
  const triggers = useTriggerSnapshotList<TriggerConfigType>(interactionManager.triggerManager, ClickCellContent.id);
  return (col_index: number, row_index: number, row_data: AnyObject) => {
    const relatedTriggers = triggers.filter((it) => get(it.config, 'column') == col_index);
    if (relatedTriggers.length !== 0) {
      return () => {
        const payload = {
          row_data,
          row_index,
          col_index,
        };
        for (const trigger of relatedTriggers) {
          void interactionManager.runInteraction(trigger.id, payload);
        }
      };
    }
  };
};

export function VizTable({ context, instance }: VizViewProps) {
  const data = (context.data ?? []) as AnyObject[];
  const { height, width } = context.viewport;
  const { value: conf = DEFAULT_CONFIG } = useStorageData<ITableConf>(context.instanceData, 'config');
  const { id_field, use_raw_columns, columns, ...rest } = conf;

  const { classes, cx } = useTableStyles();

  const getContentClickHandler = useHandleContentClick({
    vizManager: context.vizManager,
    instance: instance,
  });

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

  const tableColumns = useMemo(() => {
    const columnHelper = createColumnHelper<AnyObject>();
    const valueCols = finalColumns.map((c) => {
      return columnHelper.accessor(c.value_field, {
        cell: (row) => <CellValue value={row.getValue()} type={c.value_type} />,
        header: c.label,
        enableSorting: true,
      });
    });
    const indexCol = columnHelper.display({
      id: '#index',
      cell: (ctx) => ctx.row.index + 1,
      header: '#',
      size: 10 * (data.length.toString().length + 1),
    });
    return [indexCol, ...valueCols];
  }, [finalColumns]);
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

const HeadCell = ({ header, cx }: { header: Header<AnyObject, unknown>; cx: (...args: unknown[]) => string }) => {
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
