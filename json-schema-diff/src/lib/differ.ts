import { AddFiled, Differ, Difference, DiffParams, RemoveField, SchemaNode, UpdateField } from './types';

const stringDiffer = ({ accessor, src, other, node }: DiffParams) => {
  const differences: Difference[] = [];
  if (accessor.in(src) && accessor.in(other)) {
    const srcValue = accessor.get(src);
    const otherValue = accessor.get(other);
    if (srcValue !== otherValue) {
      const diff: UpdateField = {
        path: accessor.path,
        type: 'update',
        value: otherValue,
        schemaType: node.type,
      };
      differences.push(diff);
    } else {
      // do nothing
    }
  } else {
    if (accessor.in(src)) {
      differences.push({
        path: accessor.path,
        type: 'remove',
        schemaType: node.type,
      } as RemoveField);
    } else if (accessor.in(other)) {
      differences.push({
        path: accessor.path,
        type: 'add',
        value: accessor.get(other),
        schemaType: node.type,
      } as AddFiled);
    } else {
      // do nothing
    }
  }

  return differences;
};
const DIFFER_REGISTRY: Record<string, Differ> = {
  string: stringDiffer,
  id: stringDiffer,
};

export function createDiffer(field: SchemaNode): Differ {
  return DIFFER_REGISTRY[field.type];
}
