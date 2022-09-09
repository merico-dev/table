import { Button, Stack } from '@mantine/core';
import { useAsyncEffect } from 'ahooks';
import { useState } from 'react';
import { ITrigger, IVizTriggerManager, VizInstance } from '~/types/plugin';

interface ITriggerSelectProps {
  triggerId: string;
  triggerManager: IVizTriggerManager;
  instance: VizInstance;
}

function getTriggerSchema(trigger: ITrigger | undefined, triggerManager: IVizTriggerManager) {
  return triggerManager.getTriggerSchemaList().find((it) => it.id === trigger?.schemaRef);
}

function useTrigger(triggerId: string, triggerManager: IVizTriggerManager) {
  const [trigger, setTrigger] = useState<ITrigger>();
  useAsyncEffect(async () => {
    const result = await triggerManager.retrieveTrigger(triggerId);
    setTrigger(result);
  }, [triggerId, triggerManager]);
  return trigger;
}

const TriggerModalButton = (props: ITriggerSelectProps) => {
  const { triggerId, triggerManager, instance } = props;
  const trigger = useTrigger(triggerId, triggerManager);
  const triggerSchema = getTriggerSchema(trigger, triggerManager);
  if (!trigger || !triggerSchema) {
    return null;
  }
  const TriggerName = triggerSchema.nameRender;
  return (
    <Stack>
      <Button variant="outline">
        <TriggerName trigger={trigger} instance={instance} />
      </Button>
    </Stack>
  );
};

export const TriggerSelect = (props: ITriggerSelectProps) => {
  return (
    <>
      <TriggerModalButton {...props} />
    </>
  );
};
