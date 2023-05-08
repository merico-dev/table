import { IDiffTarget } from './types';
import { AnyObject, IDashboard } from '@devtable/dashboard';
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
  {
    selector: new Accessor<IDashboard, AnyObject>('views', Matcher.all),
    idSelector: (it) => it.id,
    formatDisplayName: (it) => {
      const { label, id, type } = it;
      if (label) {
        return `View: ${label}`;
      }
      return `View: ${type}[${id}]`;
    },
    produceOperation: (operationType, pointers, item) => {
      return (config: IDashboard) => {
        const views = config.views as AnyObject[];
        const index = views.findIndex((it) => it.id === item.id);
        if (operationType === 'added') {
          views.push(item);
        } else if (operationType === 'removed') {
          views.splice(index, 1);
        } else if (operationType === 'modified') {
          views[index] = item;
        }
      };
    },
  } as IDiffTarget<AnyObject, string>,
  {
    selector: new Accessor<IDashboard, AnyObject>('panels', Matcher.all),
    idSelector: (it) => it.id,
    formatDisplayName: (it) => {
      const { title, id, viz } = it;
      if (title) {
        return `Panel: ${title}`;
      }
      return `Panel: ${viz.type}[${id}]`;
    },
    produceOperation: (operationType, pointers, item) => {
      return (config: IDashboard) => {
        const panels = config.panels as AnyObject[];
        const index = panels.findIndex((it) => it.id === item.id);
        if (operationType === 'added') {
          panels.push(item);
        } else if (operationType === 'removed') {
          panels.splice(index, 1);
        } else if (operationType === 'modified') {
          panels[index] = item;
        }
      };
    },
  } as IDiffTarget<AnyObject, string>,
];
