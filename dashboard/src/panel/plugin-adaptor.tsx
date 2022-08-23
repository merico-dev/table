import { Button, Stack, Text } from '@mantine/core';
import { useAsyncEffect } from 'ahooks';
import React, { useEffect, useState } from 'react';
import {
  IConfigComponentProps,
  IViewComponentProps,
  VizConfigComponent,
  VizViewComponent,
} from '../plugins/viz-manager/components';
import { IVizManager, VizInstanceInfo } from '../plugins/viz-manager/types';
import { IVizConfig } from '../types';

type MigrationStateType = 'checking' | 'done' | 'need-migration';

function usePluginMigration(vizManager: IVizManager, instance: VizInstanceInfo) {
  const comp = vizManager.resolveComponent(instance.type);
  const [migrationState, setMigrationState] = useState<MigrationStateType>('checking');
  useAsyncEffect(async () => {
    if (migrationState !== 'checking') {
      return;
    }
    if (await comp.migrator.needMigration({ instanceData: instance.instanceData })) {
      setMigrationState('need-migration');
    } else {
      setMigrationState('done');
    }
  }, [comp, instance]);
  const handleUpdateConfigClick = async () => {
    await comp.migrator.migrate({ instanceData: instance.instanceData });
    setMigrationState('done');
  };
  return { migrationState, updateConfig: handleUpdateConfigClick };
}

export function PluginVizConfigComponent({
  setVizConf,
  ...props
}: IConfigComponentProps & { setVizConf: (val: React.SetStateAction<IVizConfig>) => void }) {
  const { vizManager, panel } = props;
  const instance = vizManager.getOrCreateInstance(panel);
  const { migrationState, updateConfig } = usePluginMigration(vizManager, instance);

  useEffect(() => {
    return instance.instanceData.watchItem<Record<string, any>>(null, (configData) => {
      setVizConf({ type: panel.viz.type, conf: configData });
    });
  }, [setVizConf]);

  if (migrationState === 'checking') {
    return <Text>Checking update...</Text>;
  }
  if (migrationState === 'need-migration') {
    return (
      <Stack justify="center" align="center">
        <Text>The configuration of this panel is outdated.</Text>
        <Button type="button" aria-label="update config" onClick={updateConfig}>
          Update Config
        </Button>
      </Stack>
    );
  }
  return <VizConfigComponent {...props} />;
}

export function PluginVizViewComponent(props: IViewComponentProps) {
  const { vizManager, panel } = props;
  const instance = vizManager.getOrCreateInstance(panel);
  const { migrationState } = usePluginMigration(vizManager, instance);
  if (migrationState === 'checking') {
    return <Text>Checking update</Text>;
  }
  if (migrationState === 'need-migration') {
    return (
      <Stack justify="center" align="center">
        <Text>The configuration of this panel is outdated, please update config in Edit mode</Text>
      </Stack>
    );
  }
  return <VizViewComponent {...props} />;
}
