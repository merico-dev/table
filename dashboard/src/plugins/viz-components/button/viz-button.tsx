import { Button, Center } from '@mantine/core';
import { defaultsDeep, template } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useModelContext } from '~/contexts';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { ClickButton } from './triggers';
import { IClickButtonConfig } from './triggers/click-button';
import { DEFAULT_CONFIG, IButtonConf } from './type';

export const VizButton = observer(({ context, instance }: VizViewProps) => {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });
  const triggers = useTriggerSnapshotList<IClickButtonConfig>(interactionManager.triggerManager, ClickButton.id);

  const model = useModelContext();
  const { value: confValue } = useStorageData<IButtonConf>(context.instanceData, 'config');
  const conf: IButtonConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { content, ...mantineProps } = conf;

  const { width, height } = context.viewport;

  const params = {
    filters: model.filters.values,
    context: model.context.current,
  };

  const handleClick = () => {
    triggers.forEach((t) => {
      interactionManager.runInteraction(t.id, {});
    });
  };
  return (
    <Center sx={{ width, height }}>
      <Button {...mantineProps} onClick={handleClick}>
        {template(content)(params)}
      </Button>
    </Center>
  );
});
