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

type StylesNames = Selectors<typeof useStyles>;

interface IProps extends DefaultProps<StylesNames, MultiSelectWidgetStylesParams> {
  radius?: MantineNumberSize;
  style?: Record<string, any>;
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  options: TSelectOption[];
  disabled: boolean;
  width: string;
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
  width,
}: IProps) => {
  const { classes, cx } = useStyles({ radius, width }, { name: 'MultiSelectWidget', classNames, styles, unstyled });
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
        transitionName="rc-select-dropdown-slide-up"
        choiceTransitionName="rc-select-selection__choice-zoom"
        style={style}
        clearIcon={() => <CloseButton />}
        value={value}
        onChange={onChange}
        onSelect={console.log}
        open
        // maxTagCount={1}
        // maxTagTextLength={10}
        // maxTagPlaceholder={(valueList) => {
        //   console.log({ valueList });
        //   return `${valueList.length} selected`;
        // }}
      >
        {options.map((o) => (
          <Option key={o.value}>
            <Group noWrap>
              <div>
                <Text size="sm" data-role="label">
                  {o.label}
                </Text>
                <Text size="xs" color="dimmed" data-role="description">
                  {o.description}
                </Text>
              </div>
            </Group>
          </Option>
        ))}
      </Select>
    </Stack>
  );
};
