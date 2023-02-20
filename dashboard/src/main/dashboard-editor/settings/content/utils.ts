import { ValidEditorPathType } from '~/model/editor';

export function isMockContext(path: ValidEditorPathType) {
  return path.length === 1 && path[0] === '_MOCK_CONTEXT_';
}
