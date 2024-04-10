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
import { ErrorMessageOrNotFound } from '~/components/filter/error-message-or-not-found';
import { useTranslation } from 'react-i18next';

export type TSelectOption = {
  label: string;
  value: string;
  description?: string;
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
  errorMessage?: string;
  required: boolean;
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
  errorMessage,
  required,
}: IProps) => {
  const { t } = useTranslation();
  const { classes, cx } = useStyles({ radius }, { name: 'MultiSelectWidget', classNames, styles, unstyled });
  const [showTooltip, setShowTooltip] = useState(false);
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
    const match = (o: TSelectOption) => o.description?.toLowerCase().includes(k) || o.label.toLowerCase().includes(k);
    return options.filter(match);
  }, [keyword, options]);

  return (
    <Stack spacing={3}>
      <Group position="apart">
        <Text className={classes.label}>
          {label}
          {required && (
            <span className={classes.required} aria-hidden="true">
              *
            </span>
          )}
        </Text>
        {tooltipVisible && (
          <Tooltip label={t('filter.widget.common.x_selected', { count: value.length })}>
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
        notFoundContent={<ErrorMessageOrNotFound errorMessage={errorMessage} />}
        maxTagTextLength={10}
        maxTagPlaceholder={(valueList) => t('filter.widget.common.x_selected', { count: valueList.length })}
        searchValue={keyword}
        onSearch={setKeyword}
        filterOption={false}
      >
        {filteredOptions.map((o) => (
          <Option key={o.value} title={o.label}>
            <Text size="sm" data-role="label">
              {o.label}
            </Text>
            {o.description && (
              <Text size="xs" color="dimmed" data-role="description">
                {o.description}
              </Text>
            )}
          </Option>
        ))}
      </Select>
    </Stack>
  );
};
