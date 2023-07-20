import { Select, Sx } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React, { forwardRef } from 'react';
import { usePanelContext } from '~/contexts';

interface IDataFieldSelector {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  clearable?: boolean;
  sx?: Sx;
}

export const DataFieldSelector = observer(
  forwardRef(
    ({ label, required, value, onChange, clearable = false, sx, ...restProps }: IDataFieldSelector, ref: $TSFixMe) => {
      const { panel } = usePanelContext();
      const options = React.useMemo(() => {
        const ret = [...panel.dataFieldOptions];
        if (!clearable) {
          return ret;
        }
        ret.unshift({ label: 'unset', value: '', group: '' });
        return ret;
      }, [panel.dataFieldOptions]);

      return (
        <Select
          ref={ref}
          label={label}
          data={options}
          value={value}
          onChange={onChange}
          required={required}
          sx={sx}
          {...restProps}
        />
      );
    },
  ),
);
