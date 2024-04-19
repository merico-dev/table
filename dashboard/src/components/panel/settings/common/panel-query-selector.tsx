import { Box, Select, Sx, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React, { forwardRef } from 'react';
import { useEditPanelContext } from '~/contexts';

type Props = {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  clearable?: boolean;
  sx?: Sx;
  queryID?: string;
  description?: string;
};

export const PanelQuerySelector = observer(
  forwardRef(
    (
      { label, required, description, value, onChange, clearable = false, sx, ...restProps }: Props,
      ref: React.ForwardedRef<HTMLInputElement>,
    ) => {
      const { panel } = useEditPanelContext();
      const options = React.useMemo(() => {
        return panel.queryOptions(value, clearable);
      }, [value, clearable]);

      if (options.length === 0) {
        return (
          <Box>
            <TextInput label={label} required={required} defaultValue={value} readOnly disabled />
          </Box>
        );
      }

      return (
        <Select
          ref={ref}
          label={label}
          description={description}
          data={options}
          value={value}
          onChange={onChange}
          required={required}
          sx={sx}
          maxDropdownHeight={500}
          {...restProps}
        />
      );
    },
  ),
);
