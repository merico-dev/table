import { Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useAsyncEffect } from 'ahooks';
import React, { useEffect, useState } from 'react';
import { MigrationResultType } from '~/plugins/instance-migrator';
import { useServiceLocator } from '~/service-locator/use-service-locator';
import { tokens } from '../plugins';
import {
  IConfigComponentProps,
  IViewComponentProps,
  VizConfigComponent,
  VizViewComponent,
} from '../plugins/viz-manager/components';
import { AnyObject, IVizConfig } from '../types';

function usePluginMigration(onMigrate?: () => void) {
  const [migrated, setMigrated] = useState(false);
  const migrator = useServiceLocator().getRequired(tokens.instanceScope.migrator);
  useAsyncEffect(async () => {
    setMigrated(migrator.migrated);
    if (migrator.migrated) {
      return;
    }
    migrator
      .runMigration()
      .then((result) => {
        if (result === MigrationResultType.migrated) {
          onMigrate?.();
        }
      })
      .finally(() => {
        setMigrated(true);
      });
  }, [migrator]);
  return migrated;
}

export function PluginVizConfigComponent({
  setVizConf,
  ...props
}: IConfigComponentProps & { setVizConf: (val: React.SetStateAction<IVizConfig['conf']>) => void }) {
  const { panel } = props;
  const instance = useServiceLocator().getRequired(tokens.instanceScope.vizInstance);
  const migrated = usePluginMigration(() => {
    showNotification({
      title: `${panel.title} - Updated`,
      message: 'Your plugin configuration has been migrated to the latest version',
    });
  });

  useAsyncEffect(async () => {
    await instance.instanceData.setItem(null, panel.viz.conf);
  }, [instance, panel.viz.type]);

  useEffect(() => {
    return instance.instanceData.watchItem<AnyObject>(null, (configData) => {
      setVizConf(configData);
    });
  }, [setVizConf, panel.viz.type]);

  if (!migrated) {
    return <Text>Checking update...</Text>;
  }
  return <VizConfigComponent {...props} />;
}

export function PluginVizViewComponent(props: IViewComponentProps) {
  const { panel } = props;
  const migrated = usePluginMigration(() => {
    showNotification({
      title: `${panel.title} - Updated`,
      message: 'Your plugin configuration has been migrated to the latest version',
    });
  });
  if (!migrated) {
    return <Text>Checking update</Text>;
  }
  return <VizViewComponent {...props} />;
}
