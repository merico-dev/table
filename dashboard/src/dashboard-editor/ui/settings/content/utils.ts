import { ValidEditorPathType } from '~/dashboard-editor/model/editor';

export function isQueryVars(path: ValidEditorPathType) {
  return path.length === 1 && path[0] === '_QUERY_VARS_';
}

export function isMockContext(path: ValidEditorPathType) {
  return path.length === 1 && path[0] === '_MOCK_CONTEXT_';
}

export function isFilter(path: ValidEditorPathType) {
  return path.length === 2 && path[0] === '_FILTERS_';
}

export function isSQLSnippets(path: ValidEditorPathType) {
  return path.length === 1 && path[0] === '_SQL_SNIPPETS_';
}

export function isSQLSnippet(path: ValidEditorPathType) {
  return path.length === 2 && path[0] === '_SQL_SNIPPETS_';
}

export function isQuery(path: ValidEditorPathType) {
  return path.length === 2 && path[0] === '_QUERIES_';
}

export function isQueries(path: ValidEditorPathType) {
  return path.length === 1 && path[0] === '_QUERIES_';
}

export function isView(path: ValidEditorPathType) {
  return path.length === 2 && path[0] === '_VIEWS_';
}

export function isPanel(path: ValidEditorPathType) {
  return path.length === 4 && path[0] === '_VIEWS_' && path[2] === '_PANELS_';
}
