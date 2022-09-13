import { Select, SelectItem, Text } from '@mantine/core';
import { defaults, isEmpty, isNumber } from 'lodash';
import { useStorageData } from '~/plugins';
import { ITableConf } from '~/plugins/viz-components/table/type';
import { ITriggerConfigProps, ITriggerSchema, VizInstance } from '~/types/plugin';

export const ClickCellContent: ITriggerSchema = {
  id: 'builtin:table:click-cell-content',
  displayName: 'Click Cell Content',
  nameRender: ClickCellContentName,
  configRender: ClickCellContentSettings,
  payload: [
    {
      name: 'row_index',
      description: 'Index of the row that the cell belongs to',
      valueType: 'number',
    },
    {
      name: 'col_index',
      description: 'Index of the column that the cell belongs to',
      valueType: 'number',
    },
    {
      name: 'row_data',
      description: 'Data of the row that the cell belongs to',
      valueType: 'object',
    },
  ],
};

export interface IClickCellContentConfig {
  // todo: we need to use id to reference the column
  /**
   * string for the field name,
   * number for the column index
   */
  column: string | number;
}

const DEFAULT_CONFIG: IClickCellContentConfig = {
  column: '',
};

function useColumnsFromConfig(instance: VizInstance): SelectItem[] {
  const { value: config } = useStorageData<ITableConf>(instance.instanceData, 'config');
  if (!config) {
    return [];
  }
  return config.columns.map((it, idx) => ({
    label: it.label,
    value: idx.toString(),
  }));
}

function getColumnsFromData(sampleData: Record<string, unknown>[]): SelectItem[] {
  if (isEmpty(sampleData)) {
    return [];
  }
  return Object.keys(sampleData[0]).map((key) => ({
    label: key,
    value: key,
  }));
}

export function ClickCellContentSettings(props: ITriggerConfigProps) {
  const columnsFromConfig = useColumnsFromConfig(props.instance);
  const columnsFromData = getColumnsFromData(props.sampleData);
  const columns = columnsFromConfig.length > 0 ? columnsFromConfig : columnsFromData;
  const { value: config, set: setConfig } = useStorageData<IClickCellContentConfig>(
    props.trigger.triggerData,
    'config',
  );
  const { column } = defaults({}, config, DEFAULT_CONFIG);
  const handleFieldChange = (col: string) => {
    if (!isNaN(+col)) {
      void setConfig({ column: +col });
    } else {
      void setConfig({ column: col });
    }
  };
  return (
    <Select
      clearable={false}
      data={columns}
      label="Choose a column"
      value={column.toString()}
      onChange={handleFieldChange}
    />
  );
}

function generateTriggerName(config: IClickCellContentConfig | undefined, columnsFromConfig: SelectItem[]) {
  if (!config) {
    return 'Click cell content (click to config)';
  }
  if (isNumber(config.column)) {
    return `Click cell of ${columnsFromConfig[config.column].label}`;
  }
  return `Click cell of ${config.column}`;
}

function ClickCellContentName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  const columnsFromConfig = useColumnsFromConfig(props.instance);
  const { value: config } = useStorageData<IClickCellContentConfig>(props.trigger.triggerData, 'config');
  return <Text>{generateTriggerName(config, columnsFromConfig)}</Text>;
}
