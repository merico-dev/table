import { Box, Group, HoverCard, Select, Sx, Text, TextInput } from '@mantine/core';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditPanelContext } from '~/contexts';
import { VariableSelectorItem } from './variable-selector-item';

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  description?: string;
  required?: boolean;
  sx?: Sx;
};

export const VariableSelector = observer(
  forwardRef<HTMLInputElement, Props>((props, ref) => {
    const { label, value, onChange, description, required, sx } = props;
    const { t } = useTranslation();
    const { panel } = useEditPanelContext();
    const options = React.useMemo(() => {
      return panel.variableOptions(value, true);
    }, [value]);

    if (options.length === 0) {
      const v = panel.explainDataKey(value);
      return (
        <HoverCard shadow="md" position="bottom-start" withinPortal zIndex={320}>
          <HoverCard.Target>
            <Box>
              <TextInput label={label} placeholder={value} readOnly disabled />
            </Box>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <Group position="left" spacing={0}>
              <Text size="xs" color={v.queryName ? 'black' : 'red'} sx={{ fontFamily: 'monospace' }}>
                {v.queryName ?? v.queryID}
              </Text>
              <Text size="xs" color="black" sx={{ fontFamily: 'monospace' }}>
                .
              </Text>
              <Text size="xs" color="red" sx={{ fontFamily: 'monospace' }}>
                {v.columnKey}
              </Text>
            </Group>
          </HoverCard.Dropdown>
        </HoverCard>
      );
    }

    return (
      <Select
        ref={ref}
        label={label}
        description={description}
        itemComponent={VariableSelectorItem}
        data={options}
        value={value}
        onChange={onChange}
        required={required}
        sx={sx}
        maxDropdownHeight={500}
      />
    );
  }),
);
