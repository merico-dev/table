import { Select } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { forwardRef, Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { JustifyContent } from './type';
import { getSelectChangeHandler } from '~/utils/mantine';

interface Props {
  label?: string;
  value?: JustifyContent;
  onChange: (v: JustifyContent) => void;
  sx?: EmotionSx;
}

export const JustifyContentSelector = forwardRef(
  ({ label, value, onChange, sx = {} }: Props, ref: Ref<HTMLInputElement>) => {
    const { t, i18n } = useTranslation();

    const options = useMemo(
      () => [
        { label: t('style.flex.justify_content.left'), value: 'left' },
        { label: t('style.flex.justify_content.center'), value: 'center' },
        { label: t('style.flex.justify_content.right'), value: 'right' },
        { label: t('style.flex.justify_content.space_between'), value: 'space-between' },
        { label: t('style.flex.justify_content.space_around'), value: 'space-around' },
        { label: t('style.flex.justify_content.space_evenly'), value: 'space-evenly' },
      ],
      [i18n.language],
    );

    return (
      <Select
        ref={ref}
        label={label ?? t('style.flex.justify_content.label')}
        data={options}
        value={value}
        onChange={getSelectChangeHandler(onChange)}
        sx={sx}
      />
    );
  },
);
