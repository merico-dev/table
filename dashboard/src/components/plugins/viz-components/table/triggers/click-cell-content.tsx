import { Alert, Mark, Select, SelectItem, Stack, Text, TextInput } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { defaults, isNumber } from 'lodash';
import { Trans, useTranslation } from 'react-i18next';
import { useStorageData } from '~/components/plugins';
import { ITableConf } from '~/components/plugins/viz-components/table/type';
import { ITriggerConfigProps, ITriggerSchema, VizInstance } from '~/types/plugin';

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

function useRawColumnsEnabled(instance: VizInstance) {
  const { value: config } = useStorageData<ITableConf>(instance.instanceData, 'config');
  return config?.use_raw_columns ?? false;
}

export function ClickCellContentSettings(props: ITriggerConfigProps) {
  const { t } = useTranslation();
  const { columnsFromConfig, columnsFromData } = useColumnsFromConfig(props.instance, props.sampleData);
  const rawColumnsEnabled = useRawColumnsEnabled(props.instance);

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

  if (rawColumnsEnabled) {
    return (
      <Stack>
        <Alert icon={<IconAlertCircle size="1rem" />} color="gray">
          <Trans i18nKey="viz.table.click_cell.why_column_data_field">
            Option <Mark>Use original data columns</Mark> is enabled, you have to address trigger column by its data
            field
          </Trans>
        </Alert>
        <TextInput
          label={t('viz.table.click_cell.column_data_field')}
          value={column.toString()}
          onChange={(e) => handleFieldChange(e.currentTarget.value)}
        />
      </Stack>
    );
  }

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

function generateTriggerName(
  config: IClickCellContentConfig | undefined,
  columnsFromConfig: SelectItem[],
  rawColumnsEnabled: boolean,
) {
  const { t } = useTranslation();
  if (!config) {
    return t('viz.table.click_cell.click_cell_content');
  }

  if (isNumber(config.column)) {
    if (rawColumnsEnabled) {
      return t('viz.table.click_cell.click_cell_of_x_th', { x: config.column + 1 });
    }

    return t('viz.table.click_cell.click_cell_of_x', { x: columnsFromConfig[config.column].label });
  }
  return t('viz.table.click_cell.click_cell_of_x', { x: config.column });
}

function ClickCellContentName(props: Omit<ITriggerConfigProps, 'sampleData'>) {
  const { columnsFromConfig } = useColumnsFromConfig(props.instance);
  const { value: config } = useStorageData<IClickCellContentConfig>(props.trigger.triggerData, 'config');
  const rawColumnsEnabled = useRawColumnsEnabled(props.instance);
  return <Text>{generateTriggerName(config, columnsFromConfig, rawColumnsEnabled)}</Text>;
}
