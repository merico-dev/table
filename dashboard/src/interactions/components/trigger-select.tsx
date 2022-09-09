import { Button, Modal, Select, Stack } from '@mantine/core';
import { useAsyncEffect, useBoolean } from 'ahooks';
import { useState } from 'react';
import { ITrigger, ITriggerSchema, IVizTriggerManager, VizInstance } from '~/types/plugin';

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

const TriggerModalButton = (props: ITriggerSelectProps & { onClick: () => void }) => {
  const { triggerId, triggerManager, instance } = props;
  const trigger = useTrigger(triggerId, triggerManager);
  const triggerSchema = getTriggerSchema(trigger, triggerManager);
  if (!trigger || !triggerSchema) {
    return null;
  }
  const TriggerName = triggerSchema.nameRender;
  return (
    <Stack>
      <Button variant="outline" onClick={props.onClick}>
        <TriggerName trigger={trigger} instance={instance} />
      </Button>
    </Stack>
  );
};

function TriggerSchemaSelect(props: {
  triggerManager: IVizTriggerManager;
  onChange: (schema: ITriggerSchema) => void;
  value?: ITriggerSchema;
}) {
  const schemaList = props.triggerManager.getTriggerSchemaList();
  const selectItems = schemaList.map((it) => ({
    label: it.displayName,
    value: it.id,
  }));

  function handleChange(schemaId: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    props.onChange(schemaList.find((it) => it.id === schemaId)!);
  }

  return <Select data={selectItems} value={props.value?.id} onChange={handleChange} />;
}

export const TriggerSelect = (props: ITriggerSelectProps) => {
  const [modalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false);
  const { triggerManager, triggerId } = props;
  const triggerSchema = getTriggerSchema(useTrigger(triggerId, triggerManager), triggerManager);

  async function handleSchemaChange(schema: ITriggerSchema) {
    await triggerManager.createOrGetTrigger(triggerId, schema);
  }

  return (
    <>
      <Modal opened={modalOpen} onClose={closeModal} title="Setup Trigger">
        <Stack>
          <TriggerSchemaSelect triggerManager={triggerManager} onChange={handleSchemaChange} value={triggerSchema} />
          {/*<TriggerSettings trigger={trigger} />*/}
        </Stack>
      </Modal>
      <TriggerModalButton onClick={openModal} {...props} />
    </>
  );
};
