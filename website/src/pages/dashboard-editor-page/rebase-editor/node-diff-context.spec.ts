import { IJsonMergeEditorProps } from './json-merge-editor';
import { IDiffTarget } from './types';
import { beforeEach } from 'vitest';
import { NodeDiffContext } from './merge-json-docs-state';

function castMock<T>(obj: object) {
  return obj as unknown as T;
}

describe('NodeDiffContext', () => {
  describe('conflicts detection', () => {
    let nodeDiffContext: NodeDiffContext;
    beforeEach(() => {
      nodeDiffContext = new NodeDiffContext(
        {} as unknown as IDiffTarget<object, string>,
        {} as unknown as IJsonMergeEditorProps['documents'],
      );
    });
    test('local === remote, no conflicts', () => {
      nodeDiffContext.setBase(
        castMock({
          get() {
            return {
              n: '1',
              id: 'id',
            };
          },
        }),
      );
      nodeDiffContext.setLocal(
        castMock({
          get() {
            return {
              n: '3',
              id: 'id',
            };
          },
        }),
      );
      nodeDiffContext.setRemote(
        castMock({
          get() {
            return {
              n: '3',
              id: 'id',
            };
          },
        }),
      );
      expect(nodeDiffContext.hasConflicts).toBe(false);
    });
    test('local !== remote, conflicts', () => {
      nodeDiffContext.setBase(
        castMock({
          get() {
            return {
              n: '1',
              id: 'id',
            };
          },
        }),
      );
      nodeDiffContext.setLocal(
        castMock({
          get() {
            return {
              n: '3',
              id: 'id',
            };
          },
        }),
      );
      nodeDiffContext.setRemote(
        castMock({
          get() {
            return {
              n: '2',
              id: 'id',
            };
          },
        }),
      );
      expect(nodeDiffContext.hasConflicts).toBe(true);
    });
  });
});
