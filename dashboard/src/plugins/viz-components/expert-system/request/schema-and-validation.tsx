import { Tabs } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useRequest } from 'ahooks';
import { IExpertSystemConf } from '../type';
import { getExpertDataSchema } from './schema';

interface ISchemaAndValidation {
  conf: IExpertSystemConf;
}
export function SchemaAndValidation({ conf }: ISchemaAndValidation) {
  const { data: schema = {} } = useRequest(async () => getExpertDataSchema(conf), {
    refreshDeps: [conf.scenario, conf.metric_set],
  });
  return (
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
  );
}
