import { Button, Stack, Text } from '@mantine/core';
import { useAsyncEffect } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { IConfigComponentProps, VizConfigComponent } from '../plugins/viz-manager/components';
import { IVizConfig } from '../types';

type MigrationStateType = 'pending' | 'done' | 'need-migration';

export function PluginVizConfigComponent({
  setVizConf,
  ...props
}: IConfigComponentProps & { setVizConf: (val: React.SetStateAction<IVizConfig>) => void }) {
  const { vizManager, panel } = props;
  const instance = vizManager.getOrCreateInstance(panel);
  const comp = vizManager.resolveComponent(panel.viz.type);
  const [migrationState, setMigrationState] = useState<MigrationStateType>('pending');
  useAsyncEffect(async () => {
    if (migrationState !== 'pending') {
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

  useEffect(() => {
    return instance.instanceData.watchItem<Record<string, any>>(null, (configData) => {
      setVizConf({ type: panel.viz.type, conf: configData });
    });
  }, [setVizConf]);

  if (migrationState === 'pending') {
    return <Text>Migration pending</Text>;
  }
  if (migrationState === 'need-migration') {
    return (
      <Stack justify="center" align="center">
        <Text>The configuration of this panel is outdated.</Text>
        <Button type="button" aria-label="update config" onClick={handleUpdateConfigClick}>
          Update Config
        </Button>
      </Stack>
    );
  }
  // show migrate button when needed
  return <VizConfigComponent {...props} />;
}
