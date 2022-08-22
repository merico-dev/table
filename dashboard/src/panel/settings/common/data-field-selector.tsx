import { Select, Sx } from '@mantine/core';
import React from 'react';

interface IDataFieldSelector {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  data: any[];
  sx?: Sx;
}

function _DataFieldSelector(
  { label, required, value, onChange, data, sx, ...restProps }: IDataFieldSelector,
  ref: any,
) {
  const options = React.useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return [];
    }

    const keys = Object.keys(data[0]);
    return keys.map((k) => ({
      label: k,
      value: k,
    }));
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
