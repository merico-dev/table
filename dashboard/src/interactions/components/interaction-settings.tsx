import { Button, Group, Stack } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { useAsyncEffect } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { Trash } from 'tabler-icons-react';
import { OperationSelect } from '~/interactions/components/operation-select';
import { useTriggerConfigModel } from '~/interactions/components/trigger-config-model';
import { TriggerSelect } from '~/interactions/components/trigger-select';
import { IVizManager } from '~/plugins';
import { AnyObject } from '~/types';
import { IPayloadVariableSchema, IVizInteraction, IVizInteractionManager, VizInstance } from '~/types/plugin';

export interface IInteractionSettingsProps {
  instance: VizInstance;
  vizManager: IVizManager;
  interactionManager: IVizInteractionManager;
  sampleData: AnyObject[];
  variables: IPayloadVariableSchema[];
}

function useInteractionList(interactionManager: IVizInteractionManager, version: number) {
  const [state, setState] = useState<IVizInteraction[]>([]);
  useAsyncEffect(async () => {
    const result = await interactionManager.getInteractionList();
    setState(result);
  }, [version]);
  return state;
}

const InteractionItem = observer(
  ({
    item,
    manager,
    instance,
    sampleData,
    variables,
    onRemove,
  }: {
    instance: VizInstance;
    item: IVizInteraction;
    manager: IVizInteractionManager;
    sampleData: AnyObject[];
    variables: IPayloadVariableSchema[];
    onRemove: (item: IVizInteraction) => void;
  }) => {
    const { triggerRef, operationRef } = item;
    const triggerConfigModel = useTriggerConfigModel(manager.triggerManager, instance);
    useAsyncEffect(async () => {
      await triggerConfigModel.configTrigger(triggerRef, sampleData);
    }, [triggerConfigModel, triggerRef, sampleData]);
    if (triggerConfigModel.isReady()) {
      const operationVariables = [...triggerConfigModel.triggerSchema.payload, ...variables];
      return (
        <Group>
          <TriggerSelect model={triggerConfigModel} />
          <OperationSelect
            instance={instance}
            operationId={operationRef}
            variables={operationVariables}
            operationManager={manager.operationManager}
          />
          <Button aria-label="delete-interaction" variant="outline" color="red" onClick={() => onRemove(item)}>
            <Trash />
          </Button>
        </Group>
      );
    }
    return null;
  },
);

export const InteractionSettings = (props: IInteractionSettingsProps) => {
  const [version, setVersion] = useState(0);
  const { interactionManager, instance, sampleData, variables } = props;
  const interactions = useInteractionList(interactionManager, version);
  const createNewInteraction = async () => {
    const trigger = await interactionManager.triggerManager.createOrGetTrigger(
      randomId(),
      interactionManager.triggerManager.getTriggerSchemaList()[0],
    );
    const operation = await interactionManager.operationManager.createOrGetOperation(
      randomId(),
      interactionManager.operationManager.getOperationSchemaList()[0],
    );
    await interactionManager.addInteraction(trigger, operation);
    setVersion((it) => it + 1);
  };

  async function handleRemoveInteraction(item: IVizInteraction) {
    await interactionManager.removeInteraction(item.id);
    setVersion((it) => it + 1);
  }

  return (
    <Stack>
      {interactions.map((it) => (
        <InteractionItem
          onRemove={handleRemoveInteraction}
          instance={instance}
          sampleData={sampleData}
          variables={variables}
          item={it}
          manager={props.interactionManager}
          key={it.id}
        />
      ))}
      <Button onClick={() => createNewInteraction()}>Add interaction</Button>
    </Stack>
  );
};
