import { Button, Group, Stack } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { useAsyncEffect } from 'ahooks';
import { useState } from 'react';
import { Trash } from 'tabler-icons-react';
import { OperationSelect } from '~/interactions/components/operation-select';
import { TriggerSelect } from '~/interactions/components/trigger-select';
import { IVizManager } from '~/plugins';
import { AnyObject } from '~/types';
import { IVizInteraction, IVizInteractionManager, VizInstance } from '~/types/plugin';

export interface IInteractionSettingsProps {
  instance: VizInstance;
  vizManager: IVizManager;
  interactionManager: IVizInteractionManager;
}

function useInteractionList(interactionManager: IVizInteractionManager, version: number) {
  const [state, setState] = useState<IVizInteraction[]>([]);
  useAsyncEffect(async () => {
    const result = await interactionManager.getInteractionList();
    setState(result);
  }, [version]);
  return state;
}

function InteractionItem({
  item,
  manager,
  instance,
  sampleData,
  onRemove,
}: {
  instance: VizInstance;
  item: IVizInteraction;
  manager: IVizInteractionManager;
  sampleData: AnyObject[];
  onRemove: (item: IVizInteraction) => void;
}) {
  const { triggerRef, operationRef } = item;
  // todo: load variables from trigger schema
  return (
    <Group>
      <TriggerSelect
        instance={instance}
        triggerId={triggerRef}
        sampleData={sampleData}
        triggerManager={manager.triggerManager}
      />
      <OperationSelect
        instance={instance}
        operationId={operationRef}
        variables={[]}
        operationManager={manager.operationManager}
      />
      <Button aria-label="delete-interaction" variant="outline" color="red" onClick={() => onRemove(item)}>
        <Trash />
      </Button>
    </Group>
  );
}

export const InteractionSettings = (props: IInteractionSettingsProps) => {
  const [version, setVersion] = useState(0);
  const { interactionManager, instance } = props;
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
          sampleData={[]}
          item={it}
          manager={props.interactionManager}
          key={it.id}
        />
      ))}
      <Button onClick={() => createNewInteraction()}>Add interaction</Button>
    </Stack>
  );
};

// todo: implement delete
