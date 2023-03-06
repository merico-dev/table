import { ActionIcon, Divider, Group, NumberInput, Stack, Tabs, Text, TextInput } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Control, Controller, useFieldArray, UseFieldArrayRemove, UseFormWatch } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { DataFieldSelector } from '~/panel/settings/common/data-field-selector';
import { defaultNumbroFormat, NumbroFormatSelector } from '~/panel/settings/common/numbro-format-selector';
import { IRadarChartConf } from '../type';

interface IDimensionField {
  control: Control<IRadarChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
  data: $TSFixMe[];
}

function DimensionField({ control, index, remove, data }: IDimensionField) {
  return (
    <Stack key={index} my={0} p="md" pr={40} sx={{ border: '1px solid #eee', position: 'relative' }}>
      <Group grow noWrap>
        <Controller
          name={`dimensions.${index}.name`}
          control={control}
          render={({ field }) => <TextInput label="Name" required sx={{ flex: 1 }} {...field} />}
        />
        <Controller
          name={`dimensions.${index}.data_key`}
          control={control}
          render={({ field }) => (
            <DataFieldSelector label="Data Key" required data={data} sx={{ flex: 1 }} {...field} />
          )}
        />
        <Controller
          name={`dimensions.${index}.max`}
          control={control}
          render={({ field }) => <NumberInput label="Max" hideControls required sx={{ flex: 1 }} {...field} />}
        />
      </Group>
      <Stack>
        <Divider mb={-15} variant="dashed" label="Value Formatter" labelPosition="center" />
        <Controller
          name={`dimensions.${index}.formatter`}
          control={control}
          render={({ field }) => <NumbroFormatSelector {...field} />}
        />
      </Stack>
      <ActionIcon
        color="red"
        variant="subtle"
        onClick={() => remove(index)}
        sx={{ position: 'absolute', top: 15, right: 5 }}
        disabled={index === 0}
      >
        <Trash size={16} />
      </ActionIcon>
    </Stack>
  );
}

interface IDimensionsField {
  control: Control<IRadarChartConf, $TSFixMe>;
  watch: UseFormWatch<IRadarChartConf>;
  data: $TSFixMe[];
}

export function DimensionsField({ control, watch, data }: IDimensionsField) {
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
      max: 100,
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
    <Stack spacing={2}>
      <Text size={14} color="#212529" fw={500} sx={{ cursor: 'default' }}>
        Dimensions
      </Text>
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
              {/* {field.name.trim() ? field.name : index + 1} */}
            </Tabs.Tab>
          ))}
          <Tabs.Tab onClick={addDimension} value="add">
            <IconPlus size={18} color="#228be6" />
          </Tabs.Tab>
        </Tabs.List>
        {controlledFields.map((field, index) => (
          <Tabs.Panel key={index} value={field.id}>
            <DimensionField data={data} control={control} index={index} remove={removeAndResetTab} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </Stack>
  );
}
