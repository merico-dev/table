import { Center, Tabs, Tooltip } from '@mantine/core';
import { IconPlus } from '@tabler/icons';
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { Control, useFieldArray, UseFormWatch } from 'react-hook-form';
import { getNewSeriesItem, IFunnelConf } from '../../type';
import { SeriesItemField } from './series-item';

interface ISeriesField {
  control: Control<IFunnelConf, $TSFixMe>;
  watch: UseFormWatch<IFunnelConf>;
  data: $TSFixMe[];
}

export const SeriesField = ({ control, watch, data }: ISeriesField) => {
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

  const addSeriesItem = () => {
    append(getNewSeriesItem());
  };

  const firstID = _.get(controlledFields, '0.id');
  const [tab, setTab] = useState<string | null>(firstID ?? null);
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
        panel: {
          padding: '0px',
          paddingTop: '6px',
        },
      }}
    >
      <Tabs.List>
        {controlledFields.map((m, i) => (
          <Tabs.Tab key={m.id} value={m.id}>
            {m.name}
          </Tabs.Tab>
        ))}
        <Tabs.Tab value="add" disabled>
          <Tooltip label="TODO">
            <Center>
              <IconPlus size={18} color="#228be6" />
            </Center>
          </Tooltip>
        </Tabs.Tab>
      </Tabs.List>

      {controlledFields.map((m, index) => (
        <Tabs.Panel key={m.id} value={m.id}>
          <SeriesItemField item={m} control={control} index={index} remove={remove} data={data} />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
