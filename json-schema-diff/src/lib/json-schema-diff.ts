import { entries } from 'lodash-es';
import type { DictionaryNode, Difference, IdNode, SchemaNode, StringNode } from './types';
import { createAccessor } from './accessor';
import { createDiffer } from './differ';

export const schema = {
  id: (): IdNode => {
    return {
      type: 'id',
    };
  },
  string: (): StringNode => {
    return {
      type: 'string',
    };
  },
  model: (name: string, fields: Record<string, SchemaNode>): DictionaryNode => {
    const fieldEntries = entries(fields);
    return {
      type: 'dictionary',
      name,
      fields: fieldEntries,
    };
  },
};

export function createPatch(schema: DictionaryNode, src: any, other: any) {
  const fields = schema.fields;
  const differences: Difference[] = [];
  for (const [key, field] of fields) {
    const accessor = createAccessor(key);
    const differ = createDiffer(field);
    const diffs = differ({ accessor, node: field, other, src });
    differences.push(...diffs);
  }
  return {
    toJSON() {
      return differences;
    },
  };
}
