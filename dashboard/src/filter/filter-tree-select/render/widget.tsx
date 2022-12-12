import TreeSelect, { SHOW_PARENT } from 'rc-tree-select';

interface IFilterTreeSelectWidget {
  style?: Record<string, any>;
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  treeData: $TSFixMe;
}
export const FilterTreeSelectWidget = ({ style, label, value, onChange, treeData }: IFilterTreeSelectWidget) => {
  return (
    <TreeSelect
      open
      allowClear
      className="check-select"
      transitionName="rc-tree-select-dropdown-slide-up"
      choiceTransitionName="rc-tree-select-selection__choice-zoom"
      style={style}
      // dropdownStyle={{ height: 200, overflow: 'auto' }}
      treeLine
      maxTagTextLength={10}
      value={value}
      autoClearSearchValue
      treeData={treeData}
      treeNodeFilterProp="title"
      treeCheckable
      showCheckedStrategy={SHOW_PARENT}
      onChange={onChange}
      onSelect={console.log}
      maxTagCount="responsive"
      maxTagPlaceholder={(valueList) => {
        console.log('Max Tag Rest Value:', valueList);
        return `${valueList.length} rest...`;
      }}
    />
  );
};
