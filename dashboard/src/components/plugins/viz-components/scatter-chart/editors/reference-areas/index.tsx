import { Button, Divider, Stack, Tabs } from '@mantine/core';
import { IconTrash } from '@tabler/icons-react';
import { useMemo } from 'react';
import { Control, Controller, useFieldArray, UseFormWatch } from 'react-hook-form';
import { Plus } from 'tabler-icons-react';
import { ReferenceAreaField } from '~/components/plugins/common-echarts-fields/reference-area/field';
import { getNewReferenceArea } from '~/components/plugins/common-echarts-fields/reference-area/types';
import { ITemplateVariable } from '~/utils';
import { IScatterChartConf } from '../../type';
import { useTranslation } from 'react-i18next';

interface IReferenceAreasField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
  variables: ITemplateVariable[];
}

export function ReferenceAreasField({ control, watch, variables }: IReferenceAreasField) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'reference_areas',
  });

  const watchFieldArray = watch('reference_areas');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const add = () => {
    const item = getNewReferenceArea();
    append(item);
  };

  const variableOptions = useMemo(() => {
    return variables.map((v) => ({
      label: v.name,
      value: v.name,
    }));
  }, [variables]);

  const yAxes = watch('y_axes');

  const yAxisOptions = useMemo(() => {
    return yAxes.map(({ name }, index) => ({
      label: name,
      value: index.toString(),
    }));
  }, [yAxes]);

  return (
    <Tabs
      defaultValue="0"
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
          <Tabs.Tab key={field.id} value={index.toString()}>
            {index + 1}
            {/* {field.name.trim() ? field.name : index + 1} */}
          </Tabs.Tab>
        ))}
        <Tabs.Tab onClick={add} value="add">
          <Plus size={18} color="#228be6" />
        </Tabs.Tab>
      </Tabs.List>
      {controlledFields.map((field, index) => (
        <Tabs.Panel key={field.id} value={index.toString()}>
          <Controller
            name={`reference_areas.${index}`}
            control={control}
            render={({ field }) => (
              <Stack>
                <ReferenceAreaField variableOptions={variableOptions} yAxisOptions={yAxisOptions} {...field} />
                <Divider mb={-10} mt={10} variant="dashed" />
                <Button leftIcon={<IconTrash size={16} />} color="red" variant="light" onClick={() => remove(index)}>
                  {t('chart.reference_area.delete')}
                </Button>
              </Stack>
            )}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}
