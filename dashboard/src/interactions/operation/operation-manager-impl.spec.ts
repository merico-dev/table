import { JsonPluginStorage } from '~/components/plugins/json-plugin-storage';
import { IDashboardOperationSchema, VizInstance } from '~/types/plugin';
import { OperationManager } from './operation-manager-impl';

const fakeOperation: IDashboardOperationSchema = {
  id: 'fake',
  displayName: 'fake',
  configRender: () => null,
  run: async () => {
    return;
  },
  createDefaultConfig: () => ({ config: { foo: 42 }, version: 233 }),
};

const operationWithoutDefaultConfigFactory: IDashboardOperationSchema = {
  id: 'withoutDefaultConfig',
  displayName: 'withoutDefaultConfig',
  configRender: () => null,
  run: async () => {
    return;
  },
};

describe('OperationManagerImpl', () => {
  describe('createOrGetOperation', () => {
    test('should create operation with default config factory', async () => {
      const storage = new JsonPluginStorage({});
      const mockInstance = {
        instanceData: storage,
      } as unknown as VizInstance;
      const manager = new OperationManager(mockInstance, [fakeOperation, operationWithoutDefaultConfigFactory]);
      const created = await manager.createOrGetOperation('a fake operation', fakeOperation);
      expect(await storage.getItem(null)).toMatchInlineSnapshot(`
        {
          "__OPERATIONS": {
            "a fake operation": {
              "data": {
                "config": {
                  "foo": 42,
                },
                "version": 233,
              },
              "id": "a fake operation",
              "schemaRef": "fake",
            },
          },
        }
      `);
      expect(await created.operationData.getItem(null)).toMatchInlineSnapshot(`
        {
          "config": {
            "foo": 42,
          },
          "version": 233,
        }
      `);
    });
    test.todo('should get existing operation');
  });
});
