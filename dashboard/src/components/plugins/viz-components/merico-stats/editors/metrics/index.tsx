import { Divider, Tabs } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { Control, UseFormWatch, useFieldArray } from 'react-hook-form';
import { ITemplateVariable } from '~/utils';
import { TMericoStatsConf, TMericoStatsMetric, getNewMetric } from '../../type';
import { MetricField } from './metric';
import { useTranslation } from 'react-i18next';
import { FieldArrayButtonStateFunc, FieldArrayTabs } from '~/components/plugins/editor-components';

interface IProps {
  control: Control<TMericoStatsConf, $TSFixMe>;
  watch: UseFormWatch<TMericoStatsConf>;
  variables: ITemplateVariable[];
}

export const MetricsField = ({ control, watch, variables }: IProps) => {
  const { t } = useTranslation();

  const getItem = () => {
    const item = getNewMetric();
    return item;
  };

  const renderTabName = (field: TMericoStatsMetric, index: number) => {
    const n = field.names.value.trim();
    return n ? n : index + 1;
  };

  const deleteDisalbed: FieldArrayButtonStateFunc<TMericoStatsMetric> = ({ field, index, fields }) => {
    return fields.length <= 1;
  };

  const variableOptions = useMemo(() => {
    return variables.map((v) => ({
      label: v.name,
      value: v.name,
    }));
  }, [variables]);

  return (
    <>
      <Divider mt={15} variant="dashed" label={t('viz.merico_stats.metric.labels')} labelPosition="center" />
      <FieldArrayTabs<TMericoStatsConf, TMericoStatsMetric>
        control={control}
        watch={watch}
        name="metrics"
        getItem={getItem}
        addButtonText={t('chart.tooltip.additional_metrics.add')}
        deleteButtonText={t('chart.tooltip.additional_metrics.delete')}
        renderTabName={renderTabName}
        deleteDisalbed={deleteDisalbed}
      >
        {({ field, index }) => (
          <MetricField control={control} index={index} variableOptions={variableOptions} watch={watch} />
        )}
      </FieldArrayTabs>
    </>
  );
};
