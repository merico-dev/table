import _ from "lodash";
import { Group, Table, Text } from '@mantine/core';
import { IColumnConf, ITableConf, ValueType } from "./type";
import React from "react";
import { CellValue } from "./value";

interface IVizTable {
  conf: ITableConf;
  data: any;
  width: number;
  height: number;
}

export function VizTable({ conf, data = [], width, height }: IVizTable) {
  const { id_field, use_raw_columns, columns, ...rest } = conf;
  const labels = React.useMemo(() => {
    if (use_raw_columns) {
      return Object.keys(data?.[0]);
    }
    return columns.map(c => c.label);
  }, [use_raw_columns, columns, data])

  const finalColumns: IColumnConf[] = React.useMemo(() => {
    if (use_raw_columns) {
      return Object.keys(data?.[0]).map(k => ({
        label: k,
        value_field: k,
        value_type: ValueType.string
      }));
    }
    return columns;
  }, [use_raw_columns, columns, data])

  return (
    // @ts-expect-error
    <Table sx={{ maxHeight: height }} {...rest}>
      <thead>
        <tr>
          {labels.map(label => <th key={label}>{label}</th>)}
        </tr>
      </thead>
      <tbody>
        {data.slice(0, 30).map((row: any, index: number) => (
          <tr key={id_field ? row[id_field] : `row-${index}`}>
            {finalColumns.map(({ value_field, value_type }) => (
              <td key={row[value_field]}>
                <Group sx={{ '&, .mantine-Text-root': { fontFamily: 'monospace', fontSize: rest.fontSize } }}>
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
              <Text color="red" size="sm">Showing only the first 30 rows to avoid causing slow performance</Text>
            </td>
          </tr>
        </tfoot>
      )}
    </Table>
  )
}