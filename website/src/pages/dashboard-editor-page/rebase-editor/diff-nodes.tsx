import { IDiffTarget } from './types';
import { AnyObject, IDashboard } from '@devtable/dashboard/src';
import { Accessor, Matcher } from '@zeeko/power-accessor';

export const diffNodes: IDiffTarget<AnyObject, string>[] = [
  {
    selector: new Accessor<IDashboard, AnyObject>('filters', Matcher.all),
    idSelector: (it) => it.id,
    formatDisplayName: (it) => {
      return `Filter: ${it.label}`;
    },
    produceOperation: (operationType, pointers, item) => {
      return (config: IDashboard) => {
        const filters = config.filters as AnyObject[];
        const index = filters.findIndex((it) => it.id === item.id);
        if (operationType === 'added') {
          filters.push(item);
        } else if (operationType === 'removed') {
          filters.splice(index, 1);
        } else if (operationType === 'modified') {
          filters[index] = item;
        }
      };
    },
  } as IDiffTarget<AnyObject, string>,
  {
    selector: new Accessor<IDashboard, AnyObject>('definition', 'sqlSnippets', Matcher.all),
    idSelector: (it) => it.key,
    formatDisplayName: (it) => {
      return `Snippet: ${it.key}`;
    },
    produceOperation: (operationType, pointers, item) => {
      return (config: IDashboard) => {
        const snippets = config.definition?.sqlSnippets as AnyObject[];
        const index = snippets.findIndex((it) => it.key === item.key);
        if (operationType === 'added') {
          snippets.push(item);
        } else if (operationType === 'removed') {
          snippets.splice(index, 1);
        } else if (operationType === 'modified') {
          snippets[index] = item;
        }
      };
    },
  } as IDiffTarget<AnyObject, string>,
  {
    selector: new Accessor<IDashboard, AnyObject>('definition', 'queries', Matcher.all),
    idSelector: (it) => it.id,
    formatDisplayName: (it) => {
      return `Query: ${it.name}`;
    },
    produceOperation: (operationType, pointers, item) => {
      return (config: IDashboard) => {
        const queries = config.definition?.queries as AnyObject[];
        const index = queries.findIndex((it) => it.id === item.id);
        if (operationType === 'added') {
          queries.push(item);
        } else if (operationType === 'removed') {
          queries.splice(index, 1);
        } else if (operationType === 'modified') {
          queries[index] = item;
        }
      };
    },
  } as IDiffTarget<AnyObject, string>,
];
