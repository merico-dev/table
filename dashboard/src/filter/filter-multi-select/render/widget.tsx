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
import { useMemo, useState } from 'react';
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

  const [keyword, setKeyword] = useState('');
  const filteredOptions = useMemo(() => {
    if (!keyword) {
      return options;
    }

    const k = keyword.toLowerCase();
    const match = (o: TSelectOption) => o.description.toLowerCase().includes(k) || o.label.toLowerCase().includes(k);
    return options.filter(match);
  }, [keyword, options]);

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
        mode="multiple"
        maxTagCount={0}
        maxTagTextLength={10}
        maxTagPlaceholder={(valueList) => `${valueList.length} selected`}
        searchValue={keyword}
        onSearch={setKeyword}
        filterOption={false}
      >
        {filteredOptions.map((o) => (
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
