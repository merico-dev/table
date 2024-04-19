import { Select, SelectItem, Text } from '@mantine/core';
import { defaults, isNumber } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins';
import { ITableConf } from '~/components/plugins/viz-components/table/type';
import { ITriggerConfigProps, ITriggerSchema, VizInstance } from '~/types/plugin';
import { extractFullQueryData } from '~/utils';

export const ClickCellContent: ITriggerSchema = {
  id: 'builtin:table:click-cell-content',
  displayName: 'viz.table.click_cell.click_cell_content',
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

function useColumnsFromConfig(instance: VizInstance, panelData?: TPanelData) {
  const { value: config } = useStorageData<ITableConf>(instance.instanceData, 'config');
  const ret: { columnsFromConfig: SelectItem[]; columnsFromData: SelectItem[] } = {
    columnsFromConfig: [],
    columnsFromData: [],
  };
  if (config) {
    ret.columnsFromConfig = config.columns.map((it, idx) => ({
      label: it.label,
      value: idx.toString(),
    }));
  }
  if (!panelData) {
    return ret;
  }
  if (config?.query_id) {
    const queryData = panelData[config.query_id];
    if (queryData?.length > 0) {
      ret.columnsFromData = Object.keys(queryData[0]).map((key) => ({
        label: key,
        value: key,
      }));
    }
  }

  return ret;
}

export function ClickCellContentSettings(props: ITriggerConfigProps) {
  const { t } = useTranslation();
  const { columnsFromConfig, columnsFromData } = useColumnsFromConfig(props.instance, props.sampleData);
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
      label={t('viz.table.click_cell.choose_a_column')}
      value={column.toString()}
      onChange={handleFieldChange}
    />
  );
}

function generateTriggerName(config: IClickCellContentConfig | undefined, columnsFromConfig: SelectItem[]) {
  const { t } = useTranslation();
  if (!config) {
    return t('viz.table.click_cell.click_cell_content');
  }
  if (isNumber(config.column)) {
    return t('viz.table.click_cell.click_cell_of_x', { x: columnsFromConfig[config.column].label });
  }
  return t('viz.table.click_cell.click_cell_of_x', { x: config.column });
}

function ClickCellContentName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  const { columnsFromConfig } = useColumnsFromConfig(props.instance);
  const { value: config } = useStorageData<IClickCellContentConfig>(props.trigger.triggerData, 'config');
  return <Text>{generateTriggerName(config, columnsFromConfig)}</Text>;
}
