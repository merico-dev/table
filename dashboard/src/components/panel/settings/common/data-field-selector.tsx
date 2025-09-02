import { Box, Group, HoverCard, MantineSize, Select, Text, TextInput } from '@mantine/core';
import { EmotionSx } from '@mantine/emotion';
import { observer } from 'mobx-react-lite';
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useEditPanelContext } from '~/contexts';
import { getSelectChangeHandler } from '~/utils/mantine';

interface IDataFieldSelector {
  label: string;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  clearable?: boolean;
  sx?: EmotionSx;
  size?: MantineSize;
  queryID?: string;
  description?: string;
  placeholder?: string;
  unsetKey?: string;
}

export const DataFieldSelector = observer(
  forwardRef(
    (
      {
        label,
        required,
        description,
        value,
        onChange,
        queryID,
        clearable = false,
        unsetKey = 'data.data_field.selector.options.unset',
        sx,
        ...restProps
      }: IDataFieldSelector,
      ref: React.ForwardedRef<HTMLInputElement>,
    ) => {
      const { t } = useTranslation();
      const { panel } = useEditPanelContext();
      const options = React.useMemo(() => {
        return panel.dataFieldOptionGroups(value, clearable, unsetKey, queryID).map((o) => ({
          ...o,
          items: o.items.map((item) => ({
            ...item,
            label: t(item.label),
          })),
        }));
      }, [value, clearable, queryID, t]);

      if (options.length === 0) {
        const v = panel.explainDataKey(value);
        return (
          <HoverCard shadow="md" position="bottom-start" withinPortal zIndex={320}>
            <HoverCard.Target>
              <Box>
                <TextInput label={label} required={required} defaultValue={v.columnKey} readOnly disabled />
              </Box>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Group justify="flex-start" gap={0}>
                <Text size="xs" c={v.queryName ? 'black' : 'red'} ff="monospace">
                  {v.queryName ?? v.queryID}
                </Text>
                <Text size="xs" c="black" ff="monospace">
                  .
                </Text>
                <Text size="xs" c="red" ff="monospace">
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
          data={options}
          value={value}
          onChange={getSelectChangeHandler(onChange)}
          required={required}
          sx={sx}
          maxDropdownHeight={500}
          {...restProps}
        />
      );
    },
  ),
);
