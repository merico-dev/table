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

export function VizTable({ conf, data, width, height }: IVizTable) {
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
        {data.map((row: any, index: number) => (
          <tr key={id_field ? row[id_field] : `row-${index}`}>
            {finalColumns.map(({ value_field, value_type }) => (
              <td key={value_field}>
                <Group sx={{ '&, *': { fontFamily: 'monospace' } }}>
                  <CellValue value={row[value_field]} type={value_type} />
                </Group>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </Table>
  )
}