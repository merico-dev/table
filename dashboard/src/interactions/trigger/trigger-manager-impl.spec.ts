/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JsonPluginStorage } from '../../plugins/json-plugin-storage';
import { MessageChannels } from '../../plugins/message-channels';
import { ITriggerSchema, VizInstance } from '../../types/plugin';
import { FAKE_TRIGGERS, testVizComponent } from '../test/helpers';
import { VizTriggerManager } from './trigger-manager-impl';

describe('TriggerManager', () => {
  let triggerManager: VizTriggerManager;
  let instance: VizInstance;
  beforeEach(() => {
    instance = {
      id: '1',
      name: 'test',
      type: 'test',
      instanceData: new JsonPluginStorage({}),
      messageChannels: new MessageChannels(),
    };
    triggerManager = new VizTriggerManager(instance, testVizComponent);
  });
  test('get list of trigger schema', () => {
    expect(triggerManager.getTriggerSchemaList()).toEqual(testVizComponent.triggers);
  });
  test('manage triggers', async () => {
    await triggerManager.createOrGetTrigger('foo', FAKE_TRIGGERS[0]);
    const t = await triggerManager.createOrGetTrigger('bar', FAKE_TRIGGERS[0]);
    await t.triggerData.setItem('foo', 'bar');
    const triggers = await triggerManager.getTriggerList();
    expect(triggers).toHaveLength(2);
    // remove trigger
    await triggerManager.removeTrigger('foo');
    expect(await triggerManager.getTriggerList()).toHaveLength(1);

    // remove other trigger should not affect the data
    const barTrigger = await triggerManager.createOrGetTrigger('bar', FAKE_TRIGGERS[0]);
    expect(await barTrigger.triggerData.getItem('foo')).toEqual('bar');
  });
  test('add trigger with invalid schema', async () => {
    await expect(
      triggerManager.createOrGetTrigger('foo', {
        ...FAKE_TRIGGERS[0],
        id: 'invalid-schema',
      } as ITriggerSchema),
    ).rejects.toThrow(/invalid-schema/);
    expect(await triggerManager.getTriggerList()).toHaveLength(0);
  });
  test('remove nonexistent trigger', async () => {
    await expect(triggerManager.removeTrigger('invalid')).resolves.toBeUndefined();
    expect(await triggerManager.getTriggerList()).toHaveLength(0);
  });
  test('persist trigger list to instance data', async () => {
    const trigger = await triggerManager.createOrGetTrigger('foo', FAKE_TRIGGERS[0]);
    const triggerManager2 = new VizTriggerManager(instance, testVizComponent);
    expect(await triggerManager2.getTriggerList()).toEqual([trigger]);
  });

  test('add triggers from different manager', async () => {
    const triggerManager2 = new VizTriggerManager(instance, testVizComponent);
    await triggerManager2.createOrGetTrigger('1', FAKE_TRIGGERS[0]);
    await triggerManager2.createOrGetTrigger('2', FAKE_TRIGGERS[0]);
    await triggerManager.createOrGetTrigger('3', FAKE_TRIGGERS[0]);
    expect(await triggerManager.getTriggerList()).toHaveLength(3);
    expect(await triggerManager2.getTriggerList()).toHaveLength(3);
  });

  test('add triggers with same id', async () => {
    const t1 = await triggerManager.createOrGetTrigger('foo', FAKE_TRIGGERS[0]);
    const t2 = await triggerManager.createOrGetTrigger('foo', FAKE_TRIGGERS[0]);
    expect(t1).toEqual(t2);
  });

  test('add triggers with same id but different schema will empty' + ' trigger data', async () => {
    const t1 = await triggerManager.createOrGetTrigger('foo', FAKE_TRIGGERS[0]);
    await t1.triggerData.setItem('foo', 'bar');
    const t2 = await triggerManager.createOrGetTrigger('foo', FAKE_TRIGGERS[1]);
    expect(await t2.triggerData.getItem('foo')).toBeUndefined();
    expect(t2.schemaRef).toEqual(FAKE_TRIGGERS[1].id);
  });
  test('trigger can store config in triggerData', async () => {
    const trigger = await triggerManager.createOrGetTrigger('column-a-click', FAKE_TRIGGERS[0]);
    await trigger.triggerData.setItem('test', 1);
    const trigger2 = await triggerManager.createOrGetTrigger('column-a-click', FAKE_TRIGGERS[0]);
    expect(await trigger2.triggerData.getItem('test')).toBe(1);
  });

  test('recreate trigger will empty trigger data', async () => {
    const trigger = await triggerManager.createOrGetTrigger('column-a-click', FAKE_TRIGGERS[0]);
    await trigger.triggerData.setItem('test', 1);
    const trigger2 = await triggerManager.createOrGetTrigger('column-a-click', FAKE_TRIGGERS[0], { recreate: true });
    expect(await trigger2.triggerData.getItem('test')).toBeUndefined();
  });
});
