import { Divider, Group, Tabs, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { InfoCircle, Plus } from 'tabler-icons-react';
import { IMericoEstimationChartConf } from '../../type';
import { TooltipMetricField } from './metric';

interface IMetricsField {
  control: Control<IMericoEstimationChartConf, $TSFixMe>;
  watch: UseFormWatch<IMericoEstimationChartConf>;
}

export const MetricsField = ({ control, watch }: IMetricsField) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'metrics',
  });

  const watchFieldArray = watch('metrics');
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

  const firstID = watch('metrics.0.id');
  const [tab, setTab] = useState<string | null>(() => firstID ?? null);
  useEffect(() => {
    if (firstID) {
      setTab((t) => (t !== null ? t : firstID));
    }
  }, [firstID]);

  return (
    <>
      <Group spacing={2} sx={{ cursor: 'default', userSelect: 'none' }}>
        <InfoCircle size={14} color="#888" />
        <Text size={14} color="#888">
          设置可以展示在基线图的指标，例如代码当量
        </Text>
      </Group>
      <Divider variant="dashed" my={10} />
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
            <Plus size={18} color="#228be6" />
          </Tabs.Tab>
        </Tabs.List>
        {controlledFields.map((m, index) => (
          <Tabs.Panel key={m.id} value={m.id}>
            <TooltipMetricField key={m.id} control={control} index={index} remove={remove} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
};
