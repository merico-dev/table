import {
  Badge,
  CloseButton,
  DefaultProps,
  Group,
  MantineNumberSize,
  Selectors,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import Select, { Option } from 'rc-select';
import { useState } from 'react';
import useStyles, { MultiSelectWidgetStylesParams } from './widget.styles';

export type TSelectOption = {
  label: string;
  value: string;
  description: string;
};

import { forwardRef } from 'react';

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  description: string;
}

export const MultiSelectOptionItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, description, ...others }: ItemProps, ref) => (
    <Option ref={ref} {...others}>
      <Group noWrap>
        <div>
          <Text size="sm" data-role="label">
            {label}
          </Text>
          <Text size="xs" color="dimmed" data-role="description">
            {description}
          </Text>
        </div>
      </Group>
    </Option>
  ),
);

type StylesNames = Selectors<typeof useStyles>;

interface IProps extends DefaultProps<StylesNames, MultiSelectWidgetStylesParams> {
  radius?: MantineNumberSize;
  style?: Record<string, any>;
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  options: TSelectOption[];
  disabled: boolean;
}

export const MultiSelectWidget = ({
  disabled,
  // styling props
  classNames,
  styles,
  unstyled,
  radius,
  style,
  // data props
  label,
  value,
  onChange,
  options,
}: IProps) => {
  const { classes, cx } = useStyles({ radius }, { name: 'MultiSelectWidget', classNames, styles, unstyled });
  const [showTooltip, setShowTooltip] = useState(value?.length > 0);
  const handleDropdownVisibleChange = (visible: boolean) => {
    setShowTooltip(visible);
  };
  const tooltipVisible = showTooltip && value?.length > 0;
  return (
    <Stack spacing={3}>
      <Group position="apart">
        <Text className={classes.label}>{label}</Text>
        {tooltipVisible && (
          <Tooltip label={`${value.length} selected`}>
            <Badge>{value.length}</Badge>
          </Tooltip>
        )}
      </Group>
      <Select
        disabled={disabled}
        allowClear
        className={cx(classes.root, 'check-select')}
        dropdownClassName={cx(classes.dropdown, '')}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        transitionName="rc-tree-select-dropdown-slide-up"
        choiceTransitionName="rc-tree-select-selection__choice-zoom"
        style={style}
        clearIcon={() => <CloseButton />}
        maxTagTextLength={10}
        value={value}
        onChange={onChange}
        onSelect={console.log}
        maxTagCount={0}
        maxTagPlaceholder={(valueList) => {
          return `${valueList.length} selected`;
        }}
      >
        {options.map((o) => (
          <MultiSelectOptionItem key={o.value} {...o} />
        ))}
      </Select>
    </Stack>
  );
};
