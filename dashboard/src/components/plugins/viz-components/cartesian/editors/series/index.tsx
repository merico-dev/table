import { ActionIcon, Button, Group, Stack, Tabs } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import React from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { Plus } from 'tabler-icons-react';
import { ICartesianChartConf, ICartesianChartSeriesItem } from '../../type';
import { DEFAULT_SCATTER_SIZE } from '../scatter-size-select/types';
import { SeriesItemField } from './series-item';

interface ISeriesField {
  control: Control<ICartesianChartConf, $TSFixMe>;
  watch: UseFormWatch<ICartesianChartConf>;
}
export function SeriesField({ control, watch }: ISeriesField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'series',
  });

  const watchFieldArray = watch('series');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const addSeries = () => {
    const s: ICartesianChartSeriesItem = {
      type: 'bar',
      name: randomId(),
      showSymbol: false,
      symbolSize: DEFAULT_SCATTER_SIZE.static,
      y_axis_data_key: 'value',
      yAxisIndex: 0,
      label_position: 'top',
      display_name_on_line: false,
      stack: '',
      color: '#000',
      step: false,
      smooth: false,
      barMinWidth: '1',
      barWidth: '10%',
      barMaxWidth: '10',
      barGap: '0%',
      lineStyle: {
        type: 'solid',
        width: 1,
      },
      hide_in_legend: false,
      group_by_key: '',
    };
    append(s);
  };

  const yAxes = watch('y_axes');

  const yAxisOptions = React.useMemo(() => {
    return yAxes.map(({ name }, index) => ({
      label: name,
      value: index.toString(),
    }));
  }, [yAxes]);

  return (
    <Tabs
      defaultValue={'0'}
      styles={{
        tab: {
          paddingTop: '0px',
          paddingBottom: '0px',
        },
        panel: {
          padding: '0px',
          paddingTop: '6px',
        },
      }}
    >
      <Tabs.List>
        {controlledFields.map((seriesItem, index) => (
          <Tabs.Tab key={seriesItem.id} value={index.toString()}>
            {index + 1}
            {/* {field.name.trim() ? field.name : index + 1} */}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={addSeries} value="add">
          <Plus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((seriesItem, index) => (
        <Tabs.Panel key={seriesItem.id} value={index.toString()}>
          <SeriesItemField
            key={seriesItem.id}
            control={control}
            index={index}
            remove={remove}
            seriesItem={seriesItem}
            yAxisOptions={yAxisOptions}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
