import { CloseButton, Group, MantineRadius, Stack, Text } from '@mantine/core';
import { TreeItem } from 'performant-array-to-tree';
import TreeSelect from 'rc-tree-select';
import { useTranslation } from 'react-i18next';
import { ErrorMessageOrNotFound } from '~/components/filter/error-message-or-not-found';
import { SwitcherIcon } from '../../common/switcher-icon';
import { TreeIcon } from '../../common/tree-icon';
import useStyles from './widget.styles';

// DefaultProps adds system props support (margin, padding, sx, unstyled, styles and classNames).
// It accepts 2 types: styles names and styles params, both of them are optional
type Props = {
  radius?: MantineRadius;
  style?: Record<string, any>;
  label: string;
  value: TreeItem;
  onChange: (v: TreeItem) => void;
  treeData: TreeItem[];
  disabled: boolean;
  errorMessage?: string;
  required: boolean;
};

export const FilterTreeSingleSelectWidget = ({
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
}: Props) => {
  const { t } = useTranslation();
  const { classes, cx } = useStyles({ radius, name: 'FilterTreeSelectWidget' });
  return (
    <Stack gap={3}>
      <Group justify="space-between">
        <Text className={classes.label}>
          {label}
          {required && (
            <span className={classes.required} aria-hidden="true">
              *
            </span>
          )}
        </Text>
      </Group>
      <TreeSelect
        disabled={disabled}
        allowClear={{ clearIcon: <CloseButton size="sm" /> }}
        multiple={false}
        labelInValue={true}
        className={cx(classes.root, 'check-select')}
        dropdownClassName={cx(classes.dropdown, '')}
        transitionName="rc-tree-select-dropdown-slide-up"
        choiceTransitionName="rc-tree-select-selection__choice-zoom"
        style={style}
        listHeight={510}
        treeLine
        // @ts-expect-error rc-tree-selecct's TreeNodeProps
        switcherIcon={SwitcherIcon}
        // @ts-expect-error rc-tree-selecct's TreeNodeProps
        treeIcon={TreeIcon}
        value={value}
        treeData={treeData}
        notFoundContent={<ErrorMessageOrNotFound errorMessage={errorMessage} />}
        treeNodeFilterProp="filterBasis"
        treeCheckable={false}
        onChange={onChange}
        onSelect={console.log}
        showSearch
      />
    </Stack>
  );
};
