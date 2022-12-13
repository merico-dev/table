import { CloseButton, DefaultProps, MantineNumberSize, Selectors, Stack, Text } from '@mantine/core';
import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';
import { SwitcherIcon } from './switcher-icon';
import useStyles, { TreeSelectWidgetStylesParams } from './widget.styles';

// This type will contain a union with all selectors defined in useStyles,
// in this case it will be `'root' | 'title' | 'description'`
type MyComponentStylesNames = Selectors<typeof useStyles>;

// DefaultProps adds system props support (margin, padding, sx, unstyled, styles and classNames).
// It accepts 2 types: styles names and styles params, both of them are optional
interface IFilterTreeSelectWidget extends DefaultProps<MyComponentStylesNames, TreeSelectWidgetStylesParams> {
  radius?: MantineNumberSize;
  style?: Record<string, any>;
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  treeData: $TSFixMe;
}

export const FilterTreeSelectWidget = ({
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
}: IFilterTreeSelectWidget) => {
  const { classes, cx } = useStyles({ radius }, { name: 'FilterTreeSelectWidget', classNames, styles, unstyled });

  return (
    <Stack spacing={3}>
      <Text className={classes.label}>{label}</Text>
      <TreeSelect
        open
        allowClear
        className={cx(classes.root, 'check-select')}
        dropdownClassName={cx(classes.dropdown, '')}
        transitionName="rc-tree-select-dropdown-slide-up"
        choiceTransitionName="rc-tree-select-selection__choice-zoom"
        style={style}
        // dropdownStyle={{ height: 200, overflow: 'auto' }}
        treeLine
        clearIcon={() => <CloseButton />}
        // @ts-expect-error rc-tree-selecct's TreeNodeProps
        switcherIcon={SwitcherIcon}
        maxTagTextLength={10}
        value={value}
        autoClearSearchValue
        treeData={treeData}
        treeNodeFilterProp="title"
        treeCheckable
        showCheckedStrategy={SHOW_PARENT}
        onChange={onChange}
        onSelect={console.log}
        maxTagCount={0}
        maxTagPlaceholder={(valueList) => {
          console.log('Max Tag Rest Value:', valueList);
          return `${valueList.length} selected...`;
        }}
      />
    </Stack>
  );
};
