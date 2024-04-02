import { Select } from '@mantine/core';
import { forwardRef, Ref, useMemo } from 'react';
import { IEchartsLabelPosition, LabelPositionOptionType } from './types';
import { useTranslation } from 'react-i18next';

interface ILabelPositionSelector {
  label: string;
  value?: IEchartsLabelPosition;
  onChange: (v: IEchartsLabelPosition | undefined) => void;
  options?: LabelPositionOptionType[];
  withOffOption?: boolean;
}

export const LabelPositionSelector = forwardRef(
  ({ label, value, onChange, options, withOffOption = false }: ILabelPositionSelector, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();
    const _options = useMemo(() => {
      if (options) {
        return options;
      }
      const ret = [
        { label: t('chart.label_position.top'), value: 'top' },
        { label: t('chart.label_position.left'), value: 'left' },
        { label: t('chart.label_position.right'), value: 'right' },
        { label: t('chart.label_position.bottom'), value: 'bottom' },
        { label: t('chart.label_position.outside'), value: 'outside' },
        { label: t('chart.label_position.inside'), value: 'inside' },
        { label: t('chart.label_position.inside_left'), value: 'insideLeft' },
        { label: t('chart.label_position.inside_right'), value: 'insideRight' },
        { label: t('chart.label_position.inside_top'), value: 'insideTop' },
        { label: t('chart.label_position.inside_bottom'), value: 'insideBottom' },
        { label: t('chart.label_position.inside_top_left'), value: 'insideTopLeft' },
        { label: t('chart.label_position.inside_bottom_left'), value: 'insideBottomLeft' },
        { label: t('chart.label_position.inside_top_right'), value: 'insideTopRight' },
        { label: t('chart.label_position.inside_bottom_right'), value: 'insideBottomRight' },
      ];
      if (withOffOption) {
        ret.unshift({ label: t('chart.label_position.off'), value: '' });
      }
      return ret;
    }, [i18n.language, options, withOffOption]);

    // @ts-expect-error null value from onChange
    return <Select ref={ref} label={label} data={_options} value={value} onChange={onChange} />;
  },
);
