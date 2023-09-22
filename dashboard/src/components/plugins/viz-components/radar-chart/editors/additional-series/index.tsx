import { Alert, Mark, Tabs } from '@mantine/core';
import { IconInfoCircle, IconPlus } from '@tabler/icons-react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Control, UseFormWatch, useFieldArray } from 'react-hook-form';
import { IRadarChartConf } from '../../type';
import { AdditionalSeriesItemField } from './additional-series-item';

type Props = {
  control: Control<IRadarChartConf, $TSFixMe>;
  watch: UseFormWatch<IRadarChartConf>;
};

export function AdditionalSeriesField({ control, watch }: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'additional_series',
  });

  const watchFieldArray = watch('additional_series');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const add = () => {
    const id = new Date().getTime().toString();
    append({
      id,
      name_key: '',
      color_key: '',
    });
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
      <Alert icon={<IconInfoCircle size={16} />} title="Additional Series">
        By setting <Mark>Series Name Key</Mark>, you may add series from more queries to the chart.
      </Alert>
      <Tabs
        value={tab}
        onTabChange={setTab}
        styles={{
          tab: {
            paddingBottom: '0px',
          },
          panel: {
            padding: '0px',
          },
        }}
      >
        <Tabs.List>
          {controlledFields.map((field, index) => (
            <Tabs.Tab key={field.id} value={field.id}>
              {index + 1}
            </Tabs.Tab>
          ))}
          <Tabs.Tab onClick={add} value="add">
            <IconPlus size={18} color="#228be6" />
          </Tabs.Tab>
        </Tabs.List>
        {controlledFields.map((field, index) => (
          <Tabs.Panel key={field.id} value={field.id}>
            <AdditionalSeriesItemField control={control} index={index} remove={removeAndResetTab} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
}
