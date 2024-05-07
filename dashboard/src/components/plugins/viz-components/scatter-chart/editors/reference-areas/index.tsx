import { Stack } from '@mantine/core';
import { useMemo } from 'react';
import { Control, Controller, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ReferenceAreaField } from '~/components/plugins/common-echarts-fields/reference-area/field';
import {
  IEchartsReferenceArea,
  getNewReferenceArea,
} from '~/components/plugins/common-echarts-fields/reference-area/types';
import { FieldArrayTabs } from '~/components/plugins/editor-components';
import { ITemplateVariable } from '~/utils';
import { IScatterChartConf } from '../../type';

interface IReferenceAreasField {
  control: Control<IScatterChartConf, $TSFixMe>;
  watch: UseFormWatch<IScatterChartConf>;
  variables: ITemplateVariable[];
}

export function ReferenceAreasField({ control, watch, variables }: IReferenceAreasField) {
  const { t } = useTranslation();

  const getItem = () => {
    const item = getNewReferenceArea();
    return item;
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

  const renderTabName = (field: IEchartsReferenceArea, index: number) => {
    // use its color and enpoints?
    return index + 1;
  };

  return (
    <FieldArrayTabs<IScatterChartConf, IEchartsReferenceArea>
      control={control}
      watch={watch}
      name="reference_areas"
      getItem={getItem}
      addButtonText={t('chart.reference_area.add')}
      deleteButtonText={t('chart.reference_area.delete')}
      renderTabName={renderTabName}
    >
      {({ field, index }) => (
        <Controller
          name={`reference_areas.${index}`}
          control={control}
          render={({ field }) => (
            <Stack>
              <ReferenceAreaField variableOptions={variableOptions} yAxisOptions={yAxisOptions} {...field} />
            </Stack>
          )}
        />
      )}
    </FieldArrayTabs>
  );
}
