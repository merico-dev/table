import { Divider, Tabs } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Control, UseFormWatch, useFieldArray } from 'react-hook-form';
import { TMericoStatsConf, getNewMetric } from '../../type';
import { MetricField } from './metric';

interface IProps {
  control: Control<TMericoStatsConf, $TSFixMe>;
  watch: UseFormWatch<TMericoStatsConf>;
}

export function MetricsField({ control, watch }: IProps) {
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

  const addDimension = () => {
    append(getNewMetric());
  };
  const firstTab = _.get(controlledFields, '0.id', null);
  const [tab, setTab] = useState<string | null>(firstTab);
  useEffect(() => {
    setTab((tab) => {
      if (tab) {
        return tab;
      }
      return firstTab;
    });
  }, [firstTab]);

  const removeAndResetTab = (params?: number | number[]) => {
    remove(params);

    const t = _.get(controlledFields, '0.id', null);
    setTab(t);
  };
  return (
    <>
      <Divider mt={15} variant="dashed" label="Metrics" labelPosition="center" />
      <Tabs
        value={tab}
        onTabChange={setTab}
        styles={{
          tab: {
            paddingTop: '0px',
            paddingBottom: '0px',
          },
          panel: {
            padding: '0px',
          },
        }}
      >
        <Tabs.List>
          {controlledFields.map((field, index) => (
            <Tabs.Tab key={index} value={field.id}>
              {field.names.value ? field.names.value : index + 1}
            </Tabs.Tab>
          ))}
          <Tabs.Tab onClick={addDimension} value="add">
            <IconPlus size={18} color="#228be6" />
          </Tabs.Tab>
        </Tabs.List>
        {controlledFields.map((field, index) => (
          <Tabs.Panel key={index} value={field.id}>
            <MetricField control={control} index={index} remove={removeAndResetTab} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
}
