/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JsonPluginStorage } from '../../plugins/json-plugin-storage';
import { MessageChannels } from '../../plugins/message-channels';
import { ITrigger, VizComponent, VizInstance } from '../../types/plugin';
import { VizTriggerManager } from './trigger-manager-impl';

const testVizComponent: VizComponent = {
  configRender: () => null,
  createConfig() {
    return 1;
  },
  migrator: null as unknown as VizComponent['migrator'],
  viewRender: () => null,
  name: 'test',
  displayName: 'test',
  triggers: [
    {
      displayName: 'click me',
      id: 'some-plugin:trigger:click',
      payload: [],
    },
    {
      displayName: 'drag me',
      id: 'some-plugin:trigger:drag',
      payload: [],
    },
  ],
};
const FAKE_TRIGGER: ITrigger = {
  id: '23333',
  payload: { foo: 123 },
  schemaRef: 'some-plugin:trigger:click',
  displayName: 'click me',
};
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
    await triggerManager.addTrigger(FAKE_TRIGGER);
    const triggers = await triggerManager.getTriggerList();
    expect(triggers).toHaveLength(1);
    expect(triggers[0].payload).toEqual({ foo: 123 });
    // remove trigger
    await triggerManager.removeTrigger(triggers[0].id);
    expect(await triggerManager.getTriggerList()).toHaveLength(0);
  });
  test('add trigger with invalid schema', async () => {
    await triggerManager.addTrigger({
      ...FAKE_TRIGGER,
      schemaRef: 'some-plugin:trigger:invalid',
    });
    expect(await triggerManager.getTriggerList()).toHaveLength(0);
  });
  test('remove nonexistent trigger', async () => {
    await triggerManager.addTrigger(FAKE_TRIGGER);
    await expect(triggerManager.removeTrigger('invalid')).resolves.toBeUndefined();
    expect(await triggerManager.getTriggerList()).toHaveLength(1);
  });
  test('persist trigger list to instance data', async () => {
    const trigger: ITrigger = FAKE_TRIGGER;
    await triggerManager.addTrigger(trigger);
    const triggerManager2 = new VizTriggerManager(instance, testVizComponent);
    expect(await triggerManager2.getTriggerList()).toEqual([trigger]);
  });

  test('add triggers from different manager', async () => {
    const triggerManager2 = new VizTriggerManager(instance, testVizComponent);
    await triggerManager2.addTrigger(FAKE_TRIGGER);
    await triggerManager2.addTrigger({ ...FAKE_TRIGGER, id: '23334' });
    await triggerManager.addTrigger({ ...FAKE_TRIGGER, id: '23335' });
    const triggers = await triggerManager.getTriggerList();
    expect(triggers).toHaveLength(3);
  });

  test('add triggers with same id', async () => {
    await triggerManager.addTrigger(FAKE_TRIGGER);
    await triggerManager.addTrigger(FAKE_TRIGGER);
    expect(await triggerManager.getTriggerList()).toHaveLength(1);
  });
});
