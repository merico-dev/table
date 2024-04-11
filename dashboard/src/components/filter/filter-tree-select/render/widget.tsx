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
import { TreeItem } from 'performant-array-to-tree';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';
import { useState } from 'react';
import { ErrorMessageOrNotFound } from '~/components/filter/error-message-or-not-found';
import { SwitcherIcon } from './switcher-icon';
import { TreeIcon } from './tree-icon';
import useStyles, { TreeSelectWidgetStylesParams } from './widget.styles';
import { useTranslation } from 'react-i18next';

// This type will contain a union with all selectors defined in useStyles,
// in this case it will be `'root' | 'title' | 'description'`
type MyComponentStylesNames = Selectors<typeof useStyles>;

// DefaultProps adds system props support (margin, padding, sx, unstyled, styles and classNames).
// It accepts 2 types: styles names and styles params, both of them are optional
interface IFilterTreeSelectWidget extends DefaultProps<MyComponentStylesNames, TreeSelectWidgetStylesParams> {
  radius?: MantineNumberSize;
  style?: Record<string, any>;
  label: string;
  value: TreeItem[];
  onChange: (v: TreeItem[]) => void;
  treeData: $TSFixMe;
  disabled: boolean;
  errorMessage?: string;
  required: boolean;
  treeCheckStrictly: boolean;
}

export const FilterTreeSelectWidget = ({
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
  treeData,
  errorMessage,
  required,
  treeCheckStrictly,
}: IFilterTreeSelectWidget) => {
  const { t } = useTranslation();
  const { classes, cx } = useStyles({ radius }, { name: 'FilterTreeSelectWidget', classNames, styles, unstyled });

  const [showTooltip, setShowTooltip] = useState(false);
  const handleDropdownVisibleChange = (visible: boolean) => {
    setShowTooltip(visible);
  };
  const tooltipVisible = showTooltip && value?.length > 0;
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
      <TreeSelect
        disabled={disabled}
        allowClear
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
        clearIcon={() => <CloseButton />}
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
      />
    </Stack>
  );
};
