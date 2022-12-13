import { TreeNodeProps } from 'rc-tree-select/lib/TreeNode';
import { SquareCheck } from 'tabler-icons-react';

export const TreeIcon = ({ expanded, selected, value, onClick, ...rest }: TreeNodeProps) => {
  return <SquareCheck className="checkbox-icon" size={16} onClick={onClick} {...rest} />;
};
