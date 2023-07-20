import { Button, Center } from '@mantine/core';
import { defaultsDeep, template } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useContentModelContext } from '~/contexts';
import { useCurrentInteractionManager, useTriggerSnapshotList } from '~/interactions';
import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '../../hooks';
import { ClickButton } from './triggers';
import { IClickButtonConfig } from './triggers/click-button';
import { DEFAULT_CONFIG, IButtonConf } from './type';

const horizontalAlignments = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const verticalAlignments = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
};

export const VizButton = observer(({ context, instance }: VizViewProps) => {
  const interactionManager = useCurrentInteractionManager({
    vizManager: context.vizManager,
    instance,
  });
  const triggers = useTriggerSnapshotList<IClickButtonConfig>(interactionManager.triggerManager, ClickButton.id);

  const contentModel = useContentModelContext();
  const { value: confValue } = useStorageData<IButtonConf>(context.instanceData, 'config');
  const conf: IButtonConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { content, horizontal_align, vertical_align, ...mantineProps } = conf;

  const { width, height } = context.viewport;

  const payload = contentModel.payloadForSQL;

  const handleClick = () => {
    triggers.forEach((t) => {
      interactionManager.runInteraction(t.id, {});
    });
  };
  return (
    <Center
      sx={{
        width,
        height,
        justifyContent: horizontalAlignments[horizontal_align],
        alignItems: verticalAlignments[vertical_align],
      }}
    >
      <Button {...mantineProps} onClick={handleClick}>
        {template(content)(payload)}
      </Button>
    </Center>
  );
});
