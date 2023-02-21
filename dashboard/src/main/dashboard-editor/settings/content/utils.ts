import { ValidEditorPathType } from '~/model/editor';

export function isMockContext(path: ValidEditorPathType) {
  return path.length === 1 && path[0] === '_MOCK_CONTEXT_';
}

export function isFilter(path: ValidEditorPathType) {
  return path.length === 2 && path[0] === '_FILTERS_';
}

export function isSQLSnippet(path: ValidEditorPathType) {
  return path.length === 2 && path[0] === '_SQL_SNIPPETS_';
}

export function isView(path: ValidEditorPathType) {
  return path.length === 2 && path[0] === '_VIEWS_';
}
