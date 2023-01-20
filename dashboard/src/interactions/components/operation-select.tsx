import { Button, Modal, Select, Stack } from '@mantine/core';
import { useAsyncEffect, useBoolean, useCreation } from 'ahooks';
import { makeAutoObservable, runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import { createElement } from 'react';
import { VariableList } from './variable-list';
import { Ready } from '~/types';
import {
  IDashboardOperation,
  IDashboardOperationSchema,
  IOperationConfigProps,
  IPayloadVariableSchema,
  IVizOperationManager,
  VizInstance,
} from '~/types/plugin';

export interface IOperationSelectProps {
  operationId: string;
  operationManager: IVizOperationManager;
  instance: VizInstance;
  variables: IPayloadVariableSchema[];
}

class OperationConfigModel {
  operationId?: string;
  operation?: IDashboardOperation;
  operationSchema?: IDashboardOperationSchema;
  variables: IPayloadVariableSchema[] = [];

  get schemaList() {
    return this.operationManager.getOperationSchemaList();
  }

  constructor(public operationManager: IVizOperationManager, public instance: VizInstance) {
    makeAutoObservable(this);
  }

  async configOperation(operationId: string, variables: IPayloadVariableSchema[]) {
    const operation = await this.operationManager.retrieveTrigger(operationId);
    const schema = this.operationManager.getOperationSchemaList().find((it) => it.id === operation?.schemaRef);
    runInAction(() => {
      this.operationId = operationId;
      this.operation = operation;
      this.operationSchema = schema;
      this.variables = variables;
    });
  }

  async changeSchema(schema: IDashboardOperationSchema) {
    if (this.operationId) {
      await this.operationManager.createOrGetOperation(this.operationId, schema);
      await this.configOperation(this.operationId, this.variables);
    }
  }
}

type ReadyOperationConfigModel = Ready<OperationConfigModel, 'operationId' | 'operation' | 'operationSchema'>;

function isReady(model: OperationConfigModel): model is ReadyOperationConfigModel {
  return !!model.operationId;
}

const OperationModalButton = observer(
  ({ model, onClick }: { model: ReadyOperationConfigModel; onClick: () => void }) => {
    const operationName = model.operationSchema?.displayName;
    return (
      <Button variant="outline" onClick={onClick}>
        {operationName}
      </Button>
    );
  },
);

const OperationSettings = observer(({ model }: { model: ReadyOperationConfigModel }) => {
  const configProps: IOperationConfigProps = {
    operation: model.operation,
    instance: model.instance,
    variables: [],
  };
  return createElement(model.operationSchema.configRender, configProps);
});

function OperationSchemaSelect({ model }: { model: ReadyOperationConfigModel }) {
  const schemaList = model.schemaList;
  const selectItems = schemaList.map((it) => ({
    label: it.displayName,
    value: it.id,
  }));

  async function handleChange(schemaId: string) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await model.changeSchema(schemaList.find((it) => it.id === schemaId)!);
  }

  return <Select label="Operation" data={selectItems} onChange={handleChange} value={model.operationSchema.id} />;
}

export const OperationSelect = observer((props: IOperationSelectProps) => {
  const [modalOpen, { setTrue: openModal, setFalse: closeModal }] = useBoolean(false);
  const { operationManager, operationId, instance, variables } = props;
  const model = useCreation(() => new OperationConfigModel(operationManager, instance), [operationManager, instance]);
  useAsyncEffect(async () => {
    await model.configOperation(operationId, variables);
  }, [operationId, model]);

  if (isReady(model)) {
    return (
      <>
        <OperationModalButton model={model} onClick={openModal} />
        <Modal size={600} opened={modalOpen} onClose={closeModal} title="Operation Settings" closeButtonLabel="close">
          <Stack>
            <OperationSchemaSelect model={model} />
            <OperationSettings model={model} />
            <VariableList title="Variables" variables={model.variables} />
          </Stack>
        </Modal>
      </>
    );
  }
  return null;
});
