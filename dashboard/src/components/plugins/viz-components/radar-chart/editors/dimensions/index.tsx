import { Alert, Divider, Stack, Tabs, Text } from '@mantine/core';
import { IconInfoCircle, IconPlus } from '@tabler/icons-react';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { defaultNumbroFormat } from '~/components/panel/settings/common/numbro-format-selector';
import { IRadarChartConf } from '../../type';
import { DimensionField } from './dimension';

interface IDimensionsField {
  control: Control<IRadarChartConf, $TSFixMe>;
  watch: UseFormWatch<IRadarChartConf>;
}

export function DimensionsField({ control, watch }: IDimensionsField) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dimensions',
  });

  const watchFieldArray = watch('dimensions');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const addDimension = () => {
    const id = new Date().getTime().toString();
    append({
      id,
      name: id,
      data_key: '',
      max: '100',
      formatter: defaultNumbroFormat,
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
              {field.name ? field.name : index + 1}
            </Tabs.Tab>
          ))}
          <Tabs.Tab onClick={addDimension} value="add">
            <IconPlus size={18} color="#228be6" />
          </Tabs.Tab>
        </Tabs.List>
        {controlledFields.map((field, index) => (
          <Tabs.Panel key={index} value={field.id}>
            <DimensionField control={control} index={index} remove={removeAndResetTab} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
}
