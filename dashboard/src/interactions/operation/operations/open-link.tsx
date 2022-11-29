import { Stack, Switch, TextInput } from '@mantine/core';
import { defaults } from 'lodash';
import { ChangeEvent, useEffect, useState } from 'react';
import { useStorageData, VersionBasedMigrator } from '~/plugins';
import { IDashboardOperation, IDashboardOperationSchema, IOperationConfigProps } from '~/types/plugin';

export interface IOpenLinkOperationConfig {
  urlTemplate: string;
  openInNewTab: boolean;
}

function useConfig<T>(props: IOperationConfigProps, defaultConfig: T) {
  const { value, set } = useStorageData<T>(props.operation.operationData, 'config');
  const [stage, setStage] = useState(defaults({}, value, defaultConfig));
  const commit = async () => {
    await set(stage);
  };
  useEffect(() => {
    setStage(defaults({}, value, defaultConfig));
  }, [value]);
  return { config: stage, setConfig: setStage, commit };
}

function OpenLinkSettings(props: IOperationConfigProps) {
  const { config, setConfig, commit } = useConfig<IOpenLinkOperationConfig>(props, {
    urlTemplate: '',
    openInNewTab: true,
  });

  async function updateUrlTemplate() {
    await commit();
  }

  async function updateOpenInTab(val: boolean) {
    setConfig({ ...config, openInNewTab: val });
    await commit();
  }

  const handleUrlTemplateChange = (ev: ChangeEvent<HTMLInputElement>) =>
    setConfig({
      ...config,
      urlTemplate: ev.currentTarget.value,
    });
  return (
    <Stack>
      <TextInput label="Url" value={config.urlTemplate} onChange={handleUrlTemplateChange} onBlur={updateUrlTemplate} />
      <Switch
        label="Open in new Tab"
        checked={config.openInNewTab}
        onChange={(e) => updateOpenInTab(e.currentTarget.checked)}
      />
    </Stack>
  );
}

async function run(payload: Record<string, unknown>, operation: IDashboardOperation) {
  const { urlTemplate, openInNewTab } = await operation.operationData.getItem<IOpenLinkOperationConfig>('config');
  window.dispatchEvent(new CustomEvent('open-link', { detail: { urlTemplate, openInNewTab, payload } }));
}

class Migrator extends VersionBasedMigrator {
  readonly VERSION = 1;

  configVersions(): void {
    this.version(1, (config) => {
      return config;
    });
  }
}
export const OpenLink: IDashboardOperationSchema = {
  displayName: 'Open Link',
  id: 'builtin:op:open-link',
  configRender: OpenLinkSettings,
  run,
  migrator: new Migrator(),
  createDefaultConfig: () => ({
    version: 1,
    config: { urlTemplate: '', openInNewTab: true },
  }),
};
