import { TreeNodeProps } from 'rc-tree-select/lib/TreeNode';

const CheckboxIcon = ({ onClick }: { onClick: () => void }) => {
  return (
    <svg
      onClick={onClick}
      className="checkbox-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <rect className="border" x="4" y="4" width="16" height="16" rx="2" />
      <rect className="checkmark-indeterminate" x="8" y="8" width="8" height="8" rx="2" stroke="none" />
      <path className="checkmark-checked" d="M9 12l2 2l4 -4" />
    </svg>
  );
};

export const TreeIcon = ({ onClick, ...rest }: TreeNodeProps) => {
  return <CheckboxIcon onClick={onClick} {...rest} />;
};
