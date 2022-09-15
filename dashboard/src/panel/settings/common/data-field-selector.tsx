import { Select, Sx } from '@mantine/core';
import React from 'react';

interface IDataFieldSelector {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  data: $TSFixMe[];
  clearable?: boolean;
  sx?: Sx;
}

function _DataFieldSelector(
  { label, required, value, onChange, data, clearable = false, sx, ...restProps }: IDataFieldSelector,
  ref: $TSFixMe,
) {
  const options = React.useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const keys = Object.keys(data[0]);
    const options = keys.map((k) => ({
      label: k,
      value: k,
    }));
    if (!clearable) {
      return options;
    }
    return options.concat([{ label: 'unset', value: '' }]);
  }, [data]);

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
}

export const DataFieldSelector = React.forwardRef(_DataFieldSelector);
