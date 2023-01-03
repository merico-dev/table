import { ActionIcon, Tabs } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { Plus } from 'tabler-icons-react';
import { IScatterChartConf } from '../../type';
import { TooltipMetricField } from './metric';

interface ITooltipMetricsField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
  data: $TSFixMe[];
}

export const TooltipMetricsField = ({ control, watch, data }: ITooltipMetricsField) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'tooltip.metrics',
  });

  const watchFieldArray = watch('tooltip.metrics');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const addMetric = () =>
    append({
      id: Date.now().toString(),
      data_key: '',
      name: '',
    });

  const firstID = watch('tooltip.metrics.0.id');
  const [tab, setTab] = useState<string | null>(() => firstID ?? null);
  useEffect(() => {
    if (firstID) {
      setTab((t) => (t !== null ? t : firstID));
    }
  }, [firstID]);

  return (
    <Tabs
      value={tab}
      onTabChange={(t) => setTab(t)}
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
        {controlledFields.map((m, i) => (
          <Tabs.Tab key={m.id} value={m.id}>
            {m.name ? m.name : i}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={addMetric} value="add">
          <ActionIcon>
            <Plus size={18} color="#228be6" />
          </ActionIcon>
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((m, index) => (
        <Tabs.Panel key={m.id} value={m.id}>
          <TooltipMetricField key={m.id} control={control} index={index} remove={remove} data={data} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
