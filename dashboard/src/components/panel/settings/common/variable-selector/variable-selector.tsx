import { Select, TextInput } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { observer } from 'mobx-react-lite';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditPanelContext } from '~/contexts';
import { VariableSelectorItem } from './variable-selector-item';
import { getSelectChangeHandler } from '~/utils/mantine';

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
  required?: boolean;
  clearable?: boolean;
  sx?: EmotionSx;
  preview?: 'aggregated' | 'formatted';
  zIndex?: number;
};

export const VariableSelector = observer(
  forwardRef<HTMLInputElement, Props>((props, ref) => {
    const {
      label,
      value,
      onChange,
      description,
      required,
      clearable = true,
      sx,
      preview = 'formatted',
      zIndex = 340,
    } = props;
    const { t } = useTranslation();
    const { panel } = useEditPanelContext();
    const options = React.useMemo(() => {
      return panel.variableOptions(value, clearable);
    }, [value, clearable]);

    if (options.length === 0) {
      return <TextInput ref={ref} label={label} placeholder={value} readOnly disabled />;
    }

    return (
      <Select
        ref={ref}
        label={label}
        description={description}
        itemComponent={(props) => <VariableSelectorItem preview={preview} {...props} />}
        data={options}
        value={value}
        required={required}
        sx={sx}
        maxDropdownHeight={500}
        comboboxProps={{
          withinPortal: true,
        }}
        onChange={getSelectChangeHandler(onChange)}
        zIndex={zIndex}
      />
    );
  }),
);
