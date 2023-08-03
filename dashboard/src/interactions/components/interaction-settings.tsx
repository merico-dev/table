import { ActionIcon, Alert, Button, Group, LoadingOverlay, Stack } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { useAsyncEffect, useCreation, useRequest } from 'ahooks';
import { throttle } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { AlertCircle, Trash } from 'tabler-icons-react';
import { IPanelInfo, IVizManager, PluginContext } from '~/components/plugins';
import { useRenderPanelContext } from '~/contexts';
import { OperationSelect } from '~/interactions/components/operation-select';
import { useTriggerConfigModel } from '~/interactions/components/trigger-config-model';
import { TriggerSelect } from '~/interactions/components/trigger-select';
import { InteractionManager } from '~/interactions/interaction-manager';
import { OPERATIONS } from '~/interactions/operation/operations';
import { IPayloadVariableSchema, IVizInteraction, IVizInteractionManager, VizInstance } from '~/types/plugin';

export interface IInteractionSettingsProps {
  instance: VizInstance;
  vizManager: IVizManager;
  interactionManager: IVizInteractionManager;
  sampleData: TPanelData;
  variables: IPayloadVariableSchema[];
}

function useInteractionList(interactionManager: IVizInteractionManager, version: number) {
  const [state, setState] = useState<IVizInteraction[]>([]);
  useAsyncEffect(async () => {
    const result = await interactionManager.getInteractionList();
    setState(result);
  }, [version, interactionManager]);
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
    sampleData: TPanelData;
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
          <ActionIcon aria-label="delete-interaction" variant="filled" color="red" onClick={() => onRemove(item)}>
            <Trash size={16} />
          </ActionIcon>
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

  const { data = 0, loading } = useRequest(async () => {
    try {
      const list = await interactionManager.triggerManager.getTriggerSchemaList();
      return list.length;
    } catch (error) {
      return 0;
    }
  });

  return (
    <Stack>
      <LoadingOverlay visible={loading} />
      {data === 0 && (
        <Alert icon={<AlertCircle size={16} />} title="Unavailable" color="gray">
          This visualization does not have available interactions to choose from
        </Alert>
      )}
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
      <Button style={{ width: 'fit-content' }} onClick={() => createNewInteraction()} disabled={data === 0}>
        Add interaction
      </Button>
    </Stack>
  );
};

const useInteractionSettingsProps = (): IInteractionSettingsProps => {
  const { panel, data } = useRenderPanelContext();
  const viz = panel.viz;
  const { vizManager } = useContext(PluginContext);
  const panelInfo: IPanelInfo = panel.json;
  const instance = useCreation(() => vizManager.getOrCreateInstance(panelInfo), [vizManager, panelInfo]);
  const interactionManager = useCreation(
    () => new InteractionManager(instance, vizManager.resolveComponent(viz.type), OPERATIONS),
    [instance, viz.type],
  );
  useEffect(() => {
    return instance.instanceData.watchItem(
      null,
      // avoid too many updates
      throttle(
        (value) => {
          panel.viz.setConf(value);
        },
        100,
        { leading: false, trailing: true },
      ),
    );
  }, [instance]);

  return {
    instance,
    vizManager,
    interactionManager,
    sampleData: data,
    variables: [],
  };
};

export const InteractionSettingsPanel = () => {
  const props = useInteractionSettingsProps();
  return <InteractionSettings {...props} />;
};
