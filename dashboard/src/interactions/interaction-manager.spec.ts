import { SpyInstance } from 'vitest';

import { JsonPluginStorage } from '~/components/plugins/json-plugin-storage';
import { MessageChannels } from '~/components/plugins/message-channels';
import { IVizInteractionManager } from '~/types/plugin';
import { InteractionManager } from './interaction-manager';
import { FAKE_OPERATIONS, FAKE_TRIGGERS, testVizComponent } from './test/helpers';

describe('InteractionManager', () => {
  let interactionManager: IVizInteractionManager;
  let operationSpy: SpyInstance;
  beforeEach(() => {
    interactionManager = new InteractionManager(
      {
        id: 'some-chart',
        name: testVizComponent.name,
        type: testVizComponent.name,
        instanceData: new JsonPluginStorage({}),
        messageChannels: new MessageChannels(),
      },
      testVizComponent,
      FAKE_OPERATIONS,
    );
    operationSpy = vi.spyOn(FAKE_OPERATIONS[0], 'run');
  });
  test('manage interactions', async () => {
    const trigger = await interactionManager.triggerManager.createOrGetTrigger('click-link', FAKE_TRIGGERS[0]);
    const operation = await interactionManager.operationManager.createOrGetOperation(
      'open-new-tab',
      FAKE_OPERATIONS[0],
    );
    await interactionManager.addInteraction(trigger, operation);
    const interactions = await interactionManager.getInteractionList();
    expect(interactions).toHaveLength(1);

    // remove interaction
    await interactionManager.removeInteraction(interactions[0].id);
    expect(await interactionManager.getInteractionList()).toHaveLength(0);
  });
  test('run operation by trigger id', async () => {
    const trigger = await interactionManager.triggerManager.createOrGetTrigger('click-link', FAKE_TRIGGERS[0]);
    const operation = await interactionManager.operationManager.createOrGetOperation(
      'open-new-tab',
      FAKE_OPERATIONS[0],
    );
    await interactionManager.addInteraction(trigger, operation);
    await interactionManager.runInteraction(trigger.id, { foo: 'bar' });
    expect(operationSpy).toHaveBeenCalledWith({ foo: 'bar' }, expect.anything());
  });

  test('do not throw when operation.run throws', async () => {
    const trigger = await interactionManager.triggerManager.createOrGetTrigger('click-link', FAKE_TRIGGERS[0]);
    const op1 = await interactionManager.operationManager.createOrGetOperation('open-new-tab', FAKE_OPERATIONS[0]);
    const op2 = await interactionManager.operationManager.createOrGetOperation('open-new-tab-v2', FAKE_OPERATIONS[0]);
    await interactionManager.addInteraction(trigger, op1);
    await interactionManager.addInteraction(trigger, op2);
    operationSpy.mockImplementationOnce(() => {
      throw new Error('some error');
    });
    await expect(interactionManager.runInteraction(trigger.id, { foo: 'bar' })).resolves.not.toThrow();
    expect(operationSpy).toHaveBeenCalledTimes(2);
  });

  test('do not add duplicated interaction', async () => {
    const trigger = await interactionManager.triggerManager.createOrGetTrigger('click-link', FAKE_TRIGGERS[0]);
    const op1 = await interactionManager.operationManager.createOrGetOperation('open-new-tab', FAKE_OPERATIONS[0]);
    const op2 = await interactionManager.operationManager.createOrGetOperation('open-new-tab', FAKE_OPERATIONS[0]);
    await interactionManager.addInteraction(trigger, op1);
    await interactionManager.addInteraction(trigger, op2);
    const interactions = await interactionManager.getInteractionList();
    expect(interactions).toHaveLength(1);
  });

  test('remove interaction also removes trigger and operation when there' + ' is no reference to them', async () => {
    const t1 = await interactionManager.triggerManager.createOrGetTrigger('click-link', FAKE_TRIGGERS[0]);
    const t2 = await interactionManager.triggerManager.createOrGetTrigger('click-link-2', FAKE_TRIGGERS[1]);
    const op1 = await interactionManager.operationManager.createOrGetOperation('open-new-tab', FAKE_OPERATIONS[0]);
    await interactionManager.addInteraction(t1, op1);
    await interactionManager.addInteraction(t2, op1);
    const interactions = await interactionManager.getInteractionList();
    await interactionManager.removeInteraction(interactions[0].id);
    expect(await interactionManager.triggerManager.getTriggerList()).toHaveLength(1);
    expect(await interactionManager.operationManager.getOperationList()).toHaveLength(1);
    await interactionManager.removeInteraction(interactions[1].id);
    expect(await interactionManager.triggerManager.getTriggerList()).toHaveLength(0);
    expect(await interactionManager.operationManager.getOperationList()).toHaveLength(0);
  });
});
