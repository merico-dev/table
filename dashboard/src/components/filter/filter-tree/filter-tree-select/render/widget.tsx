import { Badge, Checkbox, CloseButton, Divider, Group, MantineRadius, Stack, Text, Tooltip } from '@mantine/core';
import { TreeItem } from 'performant-array-to-tree';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorMessageOrNotFound } from '~/components/filter/error-message-or-not-found';
import { SwitcherIcon } from '../../common/switcher-icon';
import { TreeIcon } from '../../common/tree-icon';
import useStyles from './widget.styles';
import { useSelectAll } from './use-select-all';
import { EmotionStyles } from '@mantine/emotion';
import _ from 'lodash';

const DropdownHeaderStyles: EmotionStyles = {
  root: {
    cursor: 'pointer',
    backgroundColor: '#FFF',
    '&:hover': {
      backgroundColor: 'var(--mantine-color-default-hover)',
    },
    'input, .mantine-Checkbox-labelWrapper': {
      cursor: 'pointer',
      pointerEvents: 'none',
    },
  },
};

type Props = {
  radius?: MantineRadius;
  style: Record<string, any>;
  label: string;
  value: TreeItem[];
  onChange: (v: TreeItem[]) => void;
  treeData: $TSFixMe;
  disabled: boolean;
  errorMessage?: string;
  required: boolean;
  treeCheckStrictly: boolean;
};

export const FilterTreeSelectWidget = ({
  disabled,
  // styling props
  radius,
  style,
  // data props
  label,
  value,
  onChange,
  treeData,
  errorMessage,
  required,
  treeCheckStrictly,
}: Props) => {
  const { t } = useTranslation();
  const { classes, cx } = useStyles({ radius, width: style.width, name: 'FilterTreeSelectWidget' });

  const [showTooltip, setShowTooltip] = useState(false);
  const handleDropdownVisibleChange = (visible: boolean) => {
    setShowTooltip(visible);
  };
  const tooltipVisible = showTooltip && value?.length > 0;

  const selectAll = useSelectAll(treeData, value, onChange, treeCheckStrictly);
  const [keyword, setKeyword] = useState('');

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
      <TreeSelect
        disabled={disabled}
        allowClear={{ clearIcon: <CloseButton size="sm" /> }}
        treeCheckStrictly={treeCheckStrictly}
        labelInValue={true}
        className={cx(classes.root, 'check-select')}
        dropdownClassName={cx(classes.dropdown, '')}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        transitionName="rc-tree-select-dropdown-slide-up"
        choiceTransitionName="rc-tree-select-selection__choice-zoom"
        style={style}
        listHeight={510}
        treeLine
        // @ts-expect-error rc-tree-selecct's TreeNodeProps
        switcherIcon={SwitcherIcon}
        // @ts-expect-error rc-tree-selecct's TreeNodeProps
        treeIcon={TreeIcon}
        maxTagTextLength={10}
        value={value}
        treeData={treeData}
        notFoundContent={<ErrorMessageOrNotFound errorMessage={errorMessage} />}
        treeNodeFilterProp="filterBasis"
        treeCheckable
        showCheckedStrategy={SHOW_PARENT}
        onChange={onChange}
        onSelect={console.log}
        maxTagCount={0}
        maxTagPlaceholder={() => t('filter.widget.common.x_selected', { count: value.length })}
        searchValue={keyword}
        onSearch={setKeyword}
        dropdownRender={(menu) => (
          <>
            {selectAll.allValueSet.size > 0 && !keyword && (
              <Group px="xs" pt={8} pb={8} onClick={selectAll.toggleSelectAll} styles={DropdownHeaderStyles}>
                <Checkbox
                  size="xs"
                  checked={selectAll.allSelected}
                  onChange={_.noop}
                  label={t('common.actions.select_all')}
                />
              </Group>
            )}
            <Divider />
            {menu}
          </>
        )}
      />
    </Stack>
  );
};
