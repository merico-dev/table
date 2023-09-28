import { Text } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { useAsyncEffect } from 'ahooks';
import React, { useContext, useEffect, useState } from 'react';
import { MigrationResultType, MigrationStatus } from '~/components/plugins/instance-migrator';
import { useServiceLocator } from '~/components/plugins/service/service-locator/use-service-locator';
import { IPanelInfo, tokens } from '../plugins';
import {
  IConfigComponentProps,
  IViewComponentProps,
  VizConfigComponent,
  VizViewComponent,
} from '../plugins/viz-manager/components';
import { AnyObject, IVizConfig } from '../../types';
import { LayoutStateContext } from '../..';

function usePluginMigration(onMigrate?: () => void) {
  const [migrated, setMigrated] = useState(false);
  const migrator = useServiceLocator().getRequired(tokens.instanceScope.migrator);
  useAsyncEffect(async () => {
    // if this is not the hook that creates the migration, we don't need to
    // invoke callback.
    // This is to prevent multiple migration notifications.
    const shouldRunCallback = migrator.status === MigrationStatus.notStarted;
    setMigrated(migrator.status === MigrationStatus.done);
    if (migrator.status !== MigrationStatus.notStarted) {
      return;
    }
    migrator
      .runMigration()
      .then((result) => {
        if (result === MigrationResultType.migrated) {
          if (shouldRunCallback) {
            onMigrate?.();
          }
        }
      })
      .finally(() => {
        setMigrated(true);
      });
  }, [migrator]);
  return migrated;
}

type SetVizConfType = { setVizConf: (val: React.SetStateAction<IVizConfig['conf']>) => void };

function useSyncVizConf(setVizConf: SetVizConfType['setVizConf'], panel: IPanelInfo) {
  const instance = useServiceLocator().getRequired(tokens.instanceScope.vizInstance);
  useEffect(() => {
    instance.instanceData.setItem(null, panel.viz.conf);
    return instance.instanceData.watchItem<AnyObject>(null, (configData) => {
      setVizConf(configData);
    });
  }, [setVizConf, panel.viz.type]);
  return instance;
}

export function PluginVizConfigComponent({ setVizConf, ...props }: IConfigComponentProps & SetVizConfType) {
  const { panel } = props;
  const instance = useSyncVizConf(setVizConf, panel);

  const migrated = usePluginMigration(() => {
    showNotification({
      title: `${panel.name} - Updated`,
      message: 'Your plugin configuration has been migrated to the latest version',
    });
  });

  useAsyncEffect(async () => {
    await instance.instanceData.setItem(null, panel.viz.conf);
  }, [instance, panel.viz.type]);

  if (!migrated) {
    return <Text>Checking update...</Text>;
  }
  return <VizConfigComponent {...props} />;
}

export function PluginVizViewComponent(props: IViewComponentProps & SetVizConfType) {
  const { panel, setVizConf } = props;
  useSyncVizConf(setVizConf, panel);
  const { inEditMode } = useContext(LayoutStateContext);

  const migrated = usePluginMigration(() => {
    if (!inEditMode) {
      return;
    }

    showNotification({
      title: `${panel.name} - Updated`,
      message: 'Your plugin configuration has been migrated to the latest version',
    });
  });
  if (!migrated) {
    return <Text>Checking update</Text>;
  }
  return <VizViewComponent {...props} />;
}
