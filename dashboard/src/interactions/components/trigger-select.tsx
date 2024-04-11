import { Button, Modal, Select, Stack } from '@mantine/core';
import { useBoolean } from 'ahooks';
import { observer } from 'mobx-react-lite';
import { createElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t, i18n } = useTranslation();
  const schemaList = model.schemaList;
  const selectItems = useMemo(
    () =>
      schemaList.map((it) => ({
        label: t(it.displayName),
        value: it.id,
      })),
    [schemaList, i18n.language],
  );

  async function handleChange(schemaId: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await model.changeSchema(schemaList.find((it) => it.id === schemaId)!);
  }

  return (
    <Select
      label={t('interactions.trigger.label')}
      data={selectItems}
      value={model.triggerSchema.id}
      onChange={handleChange}
    />
  );
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
  const { t } = useTranslation();
  const [modalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false);
  const model = props.model;
  return (
    <>
      <Modal opened={modalOpen} onClose={closeModal} title={t('interactions.trigger.setup')} zIndex={320}>
        <Stack>
          <TriggerSchemaSelect model={model} />
          <TriggerSettings model={model} />
          <VariableList title={t('interactions.trigger.payload')} variables={model.triggerSchema.payload} />
        </Stack>
      </Modal>
      <TriggerModalButton onClick={openModal} model={model} />
    </>
  );
});
