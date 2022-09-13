import { Group, Table, TableProps, Text } from '@mantine/core';
import { get } from 'lodash';
import React from 'react';
import { useCurrentInteractionManager } from '~/interactions/hooks/use-current-interaction-manager';
import { useTriggerSnapshotList } from '~/interactions/hooks/use-watch-triggers';
import { ClickCellContent, IClickCellContentConfig } from '~/plugins/viz-components/table/triggers/click-cell-content';
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
  const height = context.viewport.height;
  const { value: conf = DEFAULT_CONFIG } = useStorageData<ITableConf>(context.instanceData, 'config');
  const { id_field, use_raw_columns, columns, ...rest } = conf;
  const labels = React.useMemo(() => {
    if (use_raw_columns) {
      return Object.keys(data[0]);
    }
    return columns?.map((c) => c.label) || [];
  }, [use_raw_columns, columns, data]);

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
        {data.slice(0, 30).map((row: AnyObject, rowIndex: number) => (
          <tr key={id_field ? row[id_field] : `row-${rowIndex}`}>
            {finalColumns?.map(({ value_field, value_type }, colIndex) => (
              <td key={`${value_field}--${row[value_field]}`}>
                <Group
                  sx={{
                    '&, .mantine-Text-root': {
                      fontFamily: 'monospace',
                      fontSize: rest.fontSize,
                    },
                  }}
                >
                  <CellValue
                    value={row[value_field]}
                    onContentClick={getContentClickHandler(colIndex, rowIndex, row)}
                    type={value_type}
                  />
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
