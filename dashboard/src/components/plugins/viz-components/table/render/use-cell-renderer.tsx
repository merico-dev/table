import { ActionIcon, Box } from '@mantine/core';
import { IconChevronDown, IconChevronRight } from '@tabler/icons-react';
import { Cell, CellContext } from '@tanstack/react-table';
import { useCallback } from 'react';
import { AnyObject } from '~/types';
import { IColumnConf, ITableCellContext, ITableConf } from '../type';
import { CellValue } from './cell-value';

type UseCellRendererParams = {
  conf: ITableConf;
  getCellContext: (cell: Cell<AnyObject, unknown>) => ITableCellContext;
};

export function useCellRenderer({ conf, getCellContext }: UseCellRendererParams) {
  const createCellRenderer = useCallback(
    (columnConf: IColumnConf, isFirstColumn: boolean) => {
      return (cell: CellContext<AnyObject, string | number>) => {
        const cellValue = (
          <CellValue
            tableCellContext={getCellContext(cell.cell)}
            value={cell.getValue()}
            type={columnConf.value_type}
            row_data={cell.row.original}
            {...columnConf}
          />
        );

        if (!conf.sub_rows_column_key || !isFirstColumn) {
          return cellValue;
        }

        const canExpand = cell.row.getCanExpand();
        const isExpanded = cell.row.getIsExpanded();
        const depth = cell.row.depth;
        const paddingLeft = depth * 20;

        return (
          <Box style={{ paddingLeft, display: 'flex', alignItems: 'center', gap: 4 }}>
            {canExpand ? (
              <ActionIcon size="xs" variant="subtle" onClick={cell.row.getToggleExpandedHandler()}>
                {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
              </ActionIcon>
            ) : (
              <Box style={{ width: 24, height: 24 }} />
            )}
            {cellValue}
          </Box>
        );
      };
    },
    [conf.sub_rows_column_key, getCellContext],
  );

  return { createCellRenderer };
}
