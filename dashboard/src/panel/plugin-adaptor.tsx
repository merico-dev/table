import { Button, Stack, Text } from '@mantine/core';
import { useAsyncEffect } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { IConfigComponentProps, VizConfigComponent } from '../plugins/viz-manager/components';
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
    return <Text>Migration pending</Text>;
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
  // show migrate button when needed
  return <VizConfigComponent {...props} />;
}
