import { Button, Modal, Select, Stack } from '@mantine/core';
import { useAsyncEffect, useBoolean, useCreation } from 'ahooks';
import { makeAutoObservable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { createElement } from 'react';
import { AnyObject } from '~/types';
import { ITrigger, ITriggerConfigProps, ITriggerSchema, IVizTriggerManager, VizInstance } from '~/types/plugin';

interface ITriggerSelectProps {
  triggerId: string;
  triggerManager: IVizTriggerManager;
  instance: VizInstance;
  sampleData: AnyObject[];
}

const TriggerModalButton = observer(({ model, onClick }: { model: ReadyTriggerConfigModel; onClick: () => void }) => {
  const TriggerName = model.triggerSchema.nameRender;
  const props: ITriggerConfigProps = {
    trigger: model.trigger,
    instance: model.instance,
    sampleData: model.sampleData,
  };
  return (
    <Stack>
      <Button variant="outline" onClick={onClick}>
        {createElement(TriggerName, props)}
      </Button>
    </Stack>
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

  return <Select data={selectItems} value={model.triggerSchema.id} onChange={handleChange} />;
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
  const { sampleData, triggerManager, triggerId, instance } = props;
  const model = useCreation(() => new TriggerConfigModel(triggerManager, instance), [triggerManager, instance]);
  useAsyncEffect(async () => {
    await model.configTrigger(triggerId, sampleData);
  }, [triggerId, sampleData, model]);

  if (isReady(model)) {
    return (
      <>
        <Modal opened={modalOpen} onClose={closeModal} title="Setup Trigger" closeButtonLabel="close setup">
          <Stack>
            <TriggerSchemaSelect model={model} />
            <TriggerSettings model={model} />
          </Stack>
        </Modal>
        <TriggerModalButton onClick={openModal} model={model} />
      </>
    );
  }

  return null;
});

class TriggerConfigModel {
  triggerId?: string;
  trigger?: ITrigger;
  triggerSchema?: ITriggerSchema;
  sampleData?: AnyObject[];

  get schemaList() {
    return this.triggerManager.getTriggerSchemaList();
  }

  async configTrigger(triggerId: string, sampleData: AnyObject[]) {
    this.triggerId = triggerId;
    this.trigger = await this.triggerManager.retrieveTrigger(triggerId);
    this.triggerSchema = this.triggerManager.getTriggerSchemaList().find((it) => it.id === this.trigger?.schemaRef);
    this.sampleData = sampleData;
  }

  async changeSchema(schema: ITriggerSchema) {
    if (this.triggerId) {
      await this.triggerManager.createOrGetTrigger(this.triggerId, schema);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await this.configTrigger(this.triggerId, this.sampleData!);
    }
  }

  constructor(public triggerManager: IVizTriggerManager, public instance: VizInstance) {
    makeAutoObservable(this);
  }
}

type Ready<T, TK extends keyof T> = T & { [P in TK]-?: NonNullable<T[P]> };

type ReadyTriggerConfigModel = Ready<TriggerConfigModel, 'trigger' | 'triggerSchema' | 'sampleData'>;

function isReady(model: TriggerConfigModel): model is ReadyTriggerConfigModel {
  return !!model.triggerId && !!model.triggerSchema;
}
