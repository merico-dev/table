import { Box, Checkbox, Group, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';
import { observer } from 'mobx-react-lite';
import { ReadonlyRichText } from '~/components/widgets/rich-text-editor/readonly-rich-text-editor';
import { FilterMetaInstance } from '~/model';
import { FilterCheckboxConfigInstance } from '~/model';

const CheckboxTooltip = ({ description, isDescriptionEmpty }: { description: string; isDescriptionEmpty: boolean }) => {
  if (isDescriptionEmpty) {
    return null;
  }
  return (
    <Tooltip
      color="white"
      label={<ReadonlyRichText value={description} styles={{ root: { border: 'none' }, content: { padding: 0 } }} />}
      styles={{
        tooltip: {
          border: '0.0625rem solid rgb(233, 236, 239)',
          boxShadow:
            'rgb(0 0 0 / 5%) 0px 0.0625rem 0.1875rem, rgb(0 0 0 / 5%) 0px 1.25rem 1.5625rem -0.3125rem, rgb(0 0 0 / 4%) 0px 0.625rem 0.625rem -0.3125rem',
        },
      }}
      withArrow
    >
      <Box sx={{ height: '16px', alignSelf: 'center' }}>
        <IconInfoCircle size={16} color="gray" />
      </Box>
    </Tooltip>
  );
};

interface IFilterCheckbox extends Omit<FilterMetaInstance, 'key' | 'type' | 'config'> {
  config: FilterCheckboxConfigInstance;
  value: boolean;
  onChange: (v: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FilterCheckbox = observer(
  ({
    label,
    config: { default_value, description, isDescriptionEmpty, ...rest },
    value,
    onChange,
  }: IFilterCheckbox) => {
    return (
      <Box>
        <Text>&nbsp;</Text>
        <Checkbox
          label={
            <Group wrap="nowrap" justify="space-between" align="middle" gap={6}>
              <Box sx={{ flexGrow: 1 }}>{label}</Box>
              <CheckboxTooltip description={description} isDescriptionEmpty={isDescriptionEmpty} />
            </Group>
          }
          checked={value || false}
          onChange={(event) => onChange(event.currentTarget.checked)}
          {...rest}
          pt=".4em"
          styles={{
            input: {
              borderColor: '#e9ecef',
            },
          }}
        />
      </Box>
    );
  },
);
