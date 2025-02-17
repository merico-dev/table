import { Badge, Checkbox, CloseButton, Divider, Group, MantineRadius, Stack, Text, Tooltip } from '@mantine/core';
import { EmotionStyles } from '@mantine/emotion';
import _ from 'lodash';
import Select, { Option } from 'rc-select';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessageOrNotFound } from '~/components/filter/error-message-or-not-found';
import useStyles from './widget.styles';

const DropdownHeaderStyles: EmotionStyles = {
  root: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'var(--mantine-color-default-hover)',
    },
    'input, .mantine-Checkbox-labelWrapper': {
      cursor: 'pointer',
      pointerEvents: 'none',
    },
  },
};

export type TSelectOption = {
  label: string;
  value: string;
  description?: string;
};

type Props = {
  radius?: MantineRadius;
  style?: Record<string, any>;
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  options: TSelectOption[];
  disabled: boolean;
  errorMessage?: string;
  required: boolean;
};

export const MultiSelectWidget = ({
  disabled,
  // styling props
  radius,
  style,
  // data props
  label,
  value,
  onChange,
  options,
  errorMessage,
  required,
}: Props) => {
  const { t } = useTranslation();
  const { classes, cx } = useStyles({ radius, name: 'MultiSelectWidget' });
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

  const allValueSet = useMemo(() => {
    return new Set(options.map((o) => o.value));
  }, [options]);

  const selectedValueSet = useMemo(() => {
    return new Set(value);
  }, [value]);

  const allSelected = useMemo(() => {
    if (selectedValueSet.size !== allValueSet.size) {
      return false;
    }
    return Array.from(allValueSet).every((v) => selectedValueSet.has(v));
  }, [selectedValueSet, allValueSet]);

  const toggleSelectAll = () => {
    if (allSelected) {
      onChange([]);
      return;
    }
    const newValue = Array.from(allValueSet);
    onChange(newValue);
  };

  return (
    <Stack gap={3}>
      <Group justify="space-between">
        <Text className={classes.label} size="sm">
          {label}
          {required && (
            <span className={classes.required} aria-hidden="true">
              *
            </span>
          )}
        </Text>
        {tooltipVisible && (
          <Tooltip label={t('filter.widget.common.x_selected', { count: value.length })}>
            <Badge variant="light">{value.length}</Badge>
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
        clearIcon={() => <CloseButton size="sm" />}
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
        dropdownRender={(menu) => (
          <>
            {allValueSet.size > 0 && !keyword && (
              <Group px="xs" py="xs" onClick={toggleSelectAll} styles={DropdownHeaderStyles}>
                <Checkbox size="xs" checked={allSelected} onChange={_.noop} label={t('common.actions.select_all')} />
              </Group>
            )}
            <Divider />
            {menu}
          </>
        )}
      >
        {filteredOptions.map((o) => (
          <Option key={o.value} title={o.label}>
            <Text size="sm" data-role="label">
              {o.label}
            </Text>
            {o.description && (
              <Text size="xs" c="dimmed" data-role="description">
                {o.description}
              </Text>
            )}
          </Option>
        ))}
      </Select>
    </Stack>
  );
};
