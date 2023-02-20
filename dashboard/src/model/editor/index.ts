import { getRoot, Instance, types } from 'mobx-state-tree';
import { FiltersModelInstance } from '../filters';
import { QueriesModelInstance } from '../queries';
import { SQLSnippetsModelInstance } from '../sql-snippets';
import { ViewsModelInstance } from '../views';

type PartialRootInstanceType = {
  filters: FiltersModelInstance;
  views: ViewsModelInstance;
  sqlSnippets: SQLSnippetsModelInstance;
  queries: QueriesModelInstance;
};

export type NavOptionType = {
  label: string;
  value: string;
  children?: NavOptionType[];
};
export const EditorModel = types
  .model('EditorModel', {
    path: types.optional(types.string, '_FILTER_'),
    settings_open: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get navOptions() {
      const { filters, views, sqlSnippets, queries } = getRoot(self) as PartialRootInstanceType;
      const ret: Array<NavOptionType> = [
        {
          label: 'Filters',
          value: '_FILTERS_',
          children: filters.options,
        },
        {
          label: 'Mock Context',
          value: '_MOCK_CONTEXT_',
        },
        {
          label: 'SQL Snipepts',
          value: '_SQL_SNIPPETS_',
          children: sqlSnippets.options,
        },
        {
          label: 'Queries',
          value: '_QUERIES_',
          children: queries.options,
        },
        {
          label: 'Views',
          value: '_VIEWS_',
          children: views.editorOptions,
        },
      ];

      return ret;
    },
  }))
  .actions((self) => ({
    setPath(v: string) {
      self.path = v;
    },
    setSettingsOpen(v: boolean) {
      self.settings_open = v;
    },
  }))
  .actions((self) => ({
    open(path: string) {
      self.setPath(path);
      self.setSettingsOpen(true);
    },
    close() {
      self.setSettingsOpen(false);
    },
  }));

export type EditorModelInstance = Instance<typeof EditorModel>;
