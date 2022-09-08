import { Group, Table, TableProps, Text } from '@mantine/core';
import React from 'react';
import { CellValue } from './value';
import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '../..';
import { DEFAULT_CONFIG, IColumnConf, ITableConf, ValueType } from './type';

export function VizTable({ context }: VizViewProps) {
  const data = (context.data ?? []) as any[];
  const height = context.viewport.height;
  const { value: conf = DEFAULT_CONFIG } = useStorageData<ITableConf>(context.instanceData, 'config');
  const { id_field, use_raw_columns, columns, ...rest } = conf;
  const labels = React.useMemo(() => {
    if (use_raw_columns) {
      return Object.keys(data[0]);
    }
    return columns?.map((c) => c.label) || [];
  }, [use_raw_columns, columns, data]);

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
  return (
    <Table sx={{ maxHeight: height }} {...(rest as TableProps)}>
      <thead>
        <tr>
          {labels.map((label) => (
            <th key={label}>{label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.slice(0, 30).map((row: any, index: number) => (
          <tr key={id_field ? row[id_field] : `row-${index}`}>
            {finalColumns?.map(({ value_field, value_type }) => (
              <td key={`${value_field}--${row[value_field]}`}>
                <Group
                  sx={{
                    '&, .mantine-Text-root': {
                      fontFamily: 'monospace',
                      fontSize: rest.fontSize,
                    },
                  }}
                >
                  <CellValue value={row[value_field]} type={value_type} />
                </Group>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {data.length > 100 && (
        <tfoot>
          <tr>
            <td colSpan={labels.length}>
              <Text color="red" size="sm">
                Showing only the first 30 rows to avoid causing slow performance
              </Text>
            </td>
          </tr>
        </tfoot>
      )}
    </Table>
  );
}
