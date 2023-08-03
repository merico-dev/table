import { Tabs } from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { Plus } from 'tabler-icons-react';
import { useTabState } from '~/components/plugins/hooks/use-tab-state';
import { getNewSeriesItem, IHorizontalBarChartConf } from '../../type';
import { SeriesItemField } from './series-item';

interface ISeriesField {
  control: Control<IHorizontalBarChartConf, $TSFixMe>;
  watch: UseFormWatch<IHorizontalBarChartConf>;
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
    const s = getNewSeriesItem();
    append(s);
  };

  const xAxes = watch('x_axes');

  const xAxisOptions = React.useMemo(() => {
    return xAxes.map(({ name }, index) => ({
      label: name,
      value: index.toString(),
    }));
  }, [xAxes]);

  const { tab, setTab } = useTabState(controlledFields[0]?.id);
  return (
    <Tabs
      value={tab}
      onTabChange={setTab}
      styles={{
        tab: {
          paddingTop: '4px',
          paddingBottom: '4px',
        },
        panel: {
          padding: '0px',
          paddingTop: '6px',
        },
      }}
    >
      <Tabs.List>
        {controlledFields.map((seriesItem) => (
          <Tabs.Tab key={seriesItem.id} value={seriesItem.id}>
            {seriesItem.name}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={addSeries} value="add">
          <Plus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((seriesItem, index) => (
        <Tabs.Panel key={seriesItem.id} value={seriesItem.id}>
          <SeriesItemField
            key={seriesItem.id}
            control={control}
            index={index}
            remove={remove}
            seriesItem={seriesItem}
            xAxisOptions={xAxisOptions}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
