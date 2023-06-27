import { Divider, Group, Tabs, Text } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { InfoCircle, Plus } from 'tabler-icons-react';
import { ISunburstConf } from '../../type';
import { LevelField } from './level';

interface ILevelsField {
  control: Control<ISunburstConf, $TSFixMe>;
  watch: UseFormWatch<ISunburstConf>;
}

export const LevelsField = ({ control, watch }: ILevelsField) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'levels',
  });

  const watchFieldArray = watch('levels');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const addLevel = () =>
    append({
      id: Date.now().toString(),
      r0: '',
      r: '',
      label: {
        show_label_tolerance: 0.001,
        rotate: '0',
        align: 'center',
        position: 'inside',
        padding: 0,
      },
    });

  const firstID = watch('levels.0.id');
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
          Configure ring style on each level
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
              {i}
            </Tabs.Tab>
          ))}
          <Tabs.Tab onClick={addLevel} value="add">
            <Plus size={18} color="#228be6" />
          </Tabs.Tab>
        </Tabs.List>
        {controlledFields.map((m, index) => (
          <Tabs.Panel key={m.id} value={m.id}>
            <LevelField key={m.id} control={control} index={index} remove={remove} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  );
};
