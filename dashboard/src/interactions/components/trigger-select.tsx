import { Button, Modal, Select, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { createElement } from 'react';
import { ReadyTriggerConfigModel } from '~/interactions/components/trigger-config-model';
import { VariableList } from '~/interactions/components/variable-list';
import { ITriggerConfigProps } from '~/types/plugin';

export interface ITriggerSelectProps {
  model: ReadyTriggerConfigModel;
}

const TriggerModalButton = observer(({ model, onClick }: { model: ReadyTriggerConfigModel; onClick: () => void }) => {
  const TriggerName = model.triggerSchema.nameRender;
  const props: ITriggerConfigProps = {
    trigger: model.trigger,
    instance: model.instance,
    sampleData: model.sampleData,
  };
  return (
    <Button variant="outline" onClick={onClick}>
      {createElement(TriggerName, props)}
    </Button>
  );
});

const TriggerSchemaSelect = observer(({ model }: { model: ReadyTriggerConfigModel }) => {
  const schemaList = model.schemaList;
  const selectItems = schemaList.map((it) => ({
    label: it.displayName,
    value: it.id,
  }));

  async function handleChange(schemaId: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await model.changeSchema(schemaList.find((it) => it.id === schemaId)!);
  }

  return <Select label="Trigger" data={selectItems} value={model.triggerSchema.id} onChange={handleChange} />;
});

const TriggerSettings = observer(({ model }: { model: ReadyTriggerConfigModel }) => {
  const configProps: ITriggerConfigProps = {
    trigger: model.trigger,
    instance: model.instance,
    sampleData: model.sampleData,
  };
  return createElement(model.triggerSchema.configRender, configProps);
});

export const TriggerSelect = observer((props: ITriggerSelectProps) => {
  const [modalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false);
  const model = props.model;
  return (
    <>
      <Modal
        opened={modalOpen}
        onClose={closeModal}
        title="Setup Trigger"
        // TODO: figure this out
        closeButtonLabel="close setup"
        zIndex={320}
      >
        <Stack>
          <TriggerSchemaSelect model={model} />
          <TriggerSettings model={model} />
          <VariableList title="Payload" variables={model.triggerSchema.payload} />
        </Stack>
      </Modal>
      <TriggerModalButton onClick={openModal} model={model} />
    </>
  );
});
