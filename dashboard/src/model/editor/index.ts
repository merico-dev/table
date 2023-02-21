import { IconBoxMultiple, IconCodeDots, IconCopy, IconDatabase, IconFilter, TablerIcon } from '@tabler/icons';
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

export type NavActionType = {
  label: string;
  value: string;
  _type: 'ACTION';
  _action_type: '_Add_A_Filter_' | '_Add_A_SQL_SNIPPET_' | '_Add_A_QUERY_' | '_Add_A_VIEW_';
  Icon: null;
  children: null;
};
export type NavLinkType = {
  label: string;
  value: string;
  _type: 'GROUP' | 'mock_context' | 'filter' | 'sql_snippet' | 'query' | 'view' | 'panel';
  Icon?: TablerIcon;
  children?: NavOptionType[];
};
export type NavOptionType = NavLinkType | NavActionType;

function getActionOption(_action_type: NavActionType['_action_type']): NavActionType {
  return { label: _action_type, value: _action_type, _type: 'ACTION', _action_type, Icon: null, children: null };
}

export type ValidEditorPathType =
  | ['_MOCK_CONTEXT_']
  | ['_FILTERS_', string]
  | ['_SQL_SNIPPETS_', string]
  | ['_QUERIES_', string]
  | ['_VIEWS_', string]
  | ['_VIEWS_', string, '_PANELS_', string]
  | [];

function getPathFromOption(o: NavOptionType, parentID?: string): ValidEditorPathType | null {
  switch (o._type) {
    case 'GROUP':
    case 'ACTION':
      return null;
    case 'mock_context':
      return ['_MOCK_CONTEXT_'];
    case 'filter':
      return ['_FILTERS_', o.value];
    case 'sql_snippet':
      return ['_SQL_SNIPPETS_', o.value];
    case 'query':
      return ['_QUERIES_', o.value];
    case 'view':
      return ['_VIEWS_', o.value];
    case 'panel':
      if (!parentID) {
        console.error('[getPathFromOption] parentID is required');
        return null;
      }
      return ['_VIEWS_', parentID, '_PANELS_', o.value];
  }
}

export const EditorModel = types
  .model('EditorModel', {
    path: types.optional(types.frozen<ValidEditorPathType>(), []),
    settings_open: types.optional(types.boolean, false),
  })
  .views((self) => ({
    get navOptions() {
      const { filters, views, sqlSnippets, queries } = getRoot(self) as PartialRootInstanceType;
      const ret: Array<NavOptionType> = [
        {
          label: 'Mock Context',
          value: '_MOCK_CONTEXT_',
          Icon: IconCodeDots,
          _type: 'mock_context',
        },
        {
          label: 'Filters',
          value: '_FILTERS_',
          Icon: IconFilter,
          children: [...filters.options, getActionOption('_Add_A_Filter_')],
          _type: 'GROUP',
        },
        {
          label: 'SQL Snipepts',
          value: '_SQL_SNIPPETS_',
          Icon: IconCopy,
          children: [...sqlSnippets.options, getActionOption('_Add_A_SQL_SNIPPET_')],
          _type: 'GROUP',
        },
        {
          label: 'Queries',
          value: '_QUERIES_',
          Icon: IconDatabase,
          children: [...queries.options, getActionOption('_Add_A_QUERY_')],
          _type: 'GROUP',
        },
        {
          label: 'Views',
          value: '_VIEWS_',
          Icon: IconBoxMultiple,
          children: views.editorOptions,
          _type: 'GROUP',
        },
      ];

      return ret;
    },
  }))
  .actions((self) => ({
    setPath(v: ValidEditorPathType) {
      self.path = v;
    },
    setSettingsOpen(v: boolean) {
      self.settings_open = v;
    },
  }))
  .actions((self) => ({
    open(path: ValidEditorPathType) {
      self.setPath(path);
      self.setSettingsOpen(true);
    },
    close() {
      self.setSettingsOpen(false);
    },
    navigate(o: NavOptionType, parentID?: string) {
      const path = getPathFromOption(o, parentID);
      if (path) {
        self.setPath(path);
      }
    },
  }));

export type EditorModelInstance = Instance<typeof EditorModel>;
