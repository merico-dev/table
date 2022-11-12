import { Group, LoadingOverlay, Stack, Tabs, TextInput } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useRequest } from 'ahooks';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { VizConfigProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { MetricSetSelector } from './metric-set-selector';
import { getExpertDataSchema } from './request/schema';
import { ScenarioSelector } from './scenario-selector';
import { DEFAULT_CONFIG, EExperSystemScenario, IExpertSystemConf } from './type';

export function VizExpertSystemPanel({ context }: VizConfigProps) {
  const { value: confValue, set: setConf } = useStorageData<IExpertSystemConf>(context.instanceData, 'config');
  const conf: IExpertSystemConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const setConfByKey = (key: string, value: IExpertSystemConf[keyof IExpertSystemConf]) => {
    setConf({
      ...conf,
      [key]: value,
    });
  };

  const { data: schema = {} } = useRequest(async () => getExpertDataSchema(conf), {
    refreshDeps: [conf.scenario, conf.metric_set],
  });

  return (
    <Stack>
      <TextInput
        value={conf.expertSystemURL}
        onChange={(e) => {
          setConfByKey('expertSystemURL', e.currentTarget.value);
        }}
        label="Expert System URL"
        required
      />
      <Group grow>
        <ScenarioSelector conf={conf} setConfByKey={setConfByKey} />
        <MetricSetSelector conf={conf} setConfByKey={setConfByKey} />
      </Group>

      <Tabs defaultValue="validation">
        <Tabs.List>
          <Tabs.Tab value="validation">Validation</Tabs.Tab>
          <Tabs.Tab value="schema">Data Schema</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="validation" pt={6}>
          TODO
        </Tabs.Panel>
        <Tabs.Panel value="schema" pt={6}>
          <Prism my={8} language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">
            {JSON.stringify(schema, null, 2)}
          </Prism>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
