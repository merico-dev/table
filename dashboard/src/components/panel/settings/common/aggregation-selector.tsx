import { Group, NumberInput, Select, SpacingValue, SystemProp, TextInput } from '@mantine/core';
import { IconMathFunction } from '@tabler/icons-react';
import React, { ChangeEvent, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { ModalFunctionEditor } from '~/components/widgets/modal-function-editor';
import { AggregationType, DefaultCustomAggregationFunc } from '~/utils';

interface IAggregationSelector {
  value: AggregationType;
  onChange: (v: AggregationType) => void;
  label: string;
  pt?: SystemProp<SpacingValue>;
  withFallback: boolean;
}

function _AggregationSelector(
  { label, value, onChange, pt = 'sm', withFallback }: IAggregationSelector,
  ref: $TSFixMe,
) {
  const { t, i18n } = useTranslation();
  // migrate from legacy
  useEffect(() => {
    if (typeof value === 'string') {
      onChange({
        type: value,
        config: {},
        fallback: '0',
      });
    }
  }, [value, onChange]);

  // FIXME: refactor when type errors resolve
  const changeType = (type: AggregationType['type']) => {
    switch (type) {
      case 'quantile':
        return onChange({ type: 'quantile', config: { p: 0.99 }, fallback: value.fallback });
      case 'custom':
        return onChange({ type: 'custom', config: { func: DefaultCustomAggregationFunc }, fallback: value.fallback });
      case 'pick_record':
        return onChange({ type: 'pick_record', config: { method: 'first' }, fallback: value.fallback });
      default:
        return onChange({ type, config: {}, fallback: value.fallback });
    }
  };

  const changePOfQuantile = (p: number) => {
    onChange({
      type: 'quantile',
      config: {
        p,
      },
      fallback: value.fallback,
    });
  };

  const changeCustomFunc = (func: TFunctionString) => {
    onChange({
      type: 'custom',
      config: {
        func,
      },
      fallback: value.fallback,
    });
  };

  const changePickRecordMethod = (method: 'first' | 'last') => {
    onChange({
      type: 'pick_record',
      config: {
        method,
      },
      fallback: value.fallback,
    });
  };
  const changeFallback = (e: ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      fallback: e.currentTarget.value,
    });
  };

  const options: { label: string; value: AggregationType['type'] }[] = useMemo(
    () => [
      { label: t('aggregation.option.none'), value: 'none' },
      { label: t('aggregation.option.sum'), value: 'sum' },
      { label: t('aggregation.option.min'), value: 'min' },
      { label: t('aggregation.option.mean'), value: 'mean' },
      { label: t('aggregation.option.median'), value: 'median' },
      { label: t('aggregation.option.max'), value: 'max' },
      { label: t('aggregation.option.cov'), value: 'CV' },
      { label: t('aggregation.option.std'), value: 'std' },
      { label: t('aggregation.option.quantile.label_with_hint'), value: 'quantile' },
      { label: t('aggregation.option.pick_record.label'), value: 'pick_record' },
      { label: t('aggregation.option.custom.label'), value: 'custom' },
    ],
    [i18n.language],
  );

  return (
    <>
      <Group grow noWrap pt={pt}>
        <Select
          ref={ref}
          label={label}
          data={options}
          value={value.type}
          onChange={changeType}
          maxDropdownHeight={600}
        />
        {value.type === 'quantile' && (
          <NumberInput
            label="p"
            value={value.config.p}
            onChange={changePOfQuantile}
            precision={2}
            min={0.05}
            step={0.05}
            max={1}
          />
        )}
        {value.type === 'pick_record' && (
          <Select
            label={t('aggregation.option.pick_record.method.label')}
            value={value.config.method}
            onChange={changePickRecordMethod}
            data={[
              { label: t('aggregation.option.pick_record.method.first'), value: 'first' },
              { label: t('aggregation.option.pick_record.method.last'), value: 'last' },
            ]}
          />
        )}
        {value.type === 'custom' && (
          <ModalFunctionEditor
            title={t('aggregation.option.custom.title')}
            label=""
            triggerLabel={t('aggregation.option.custom.label_trigger')}
            value={value.config.func}
            onChange={changeCustomFunc}
            defaultValue={DefaultCustomAggregationFunc}
            triggerButtonProps={{
              size: 'xs',
              sx: { flexGrow: 0, alignSelf: 'center', marginTop: '22px' },
              leftIcon: <IconMathFunction size={16} />,
              color: 'grape',
            }}
          />
        )}
      </Group>
      {withFallback && (
        <TextInput
          label={t('panel.variable.aggregation.fallback_value')}
          description={t('panel.variable.aggregation.fallback_value_description')}
          value={value.fallback}
          onChange={changeFallback}
        />
      )}
    </>
  );
}

export const AggregationSelector = React.forwardRef(_AggregationSelector);
