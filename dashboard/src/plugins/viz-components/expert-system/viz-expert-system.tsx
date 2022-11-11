import { Box, LoadingOverlay, Tabs } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useRequest } from 'ahooks';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { callExpertSystem } from './call-expert-system';
import { IExpertSystemConf } from './type';

export function VizExpertSystem({ context }: VizViewProps) {
  const { value: conf } = useStorageData<IExpertSystemConf>(context.instanceData, 'config');
  const { width, height } = context.viewport;
  const contextData = (context.data as $TSFixMe[]) ?? [];
  const {
    data = {},
    error,
    loading,
  } = useRequest(
    callExpertSystem({
      baseURL: conf?.expertSystemURL,
      payload: {
        performance: {
          quality: contextData.map(({ name, ...rest }) => {
            const d = Object.entries(rest).reduce((ret, curr) => {
              ret[curr[0]] = Number(curr[1]);
              return ret;
            }, {} as Record<string, number>);

            return {
              actor: name,
              actor_type: 'project',
              code: {
                ...rest,
              },
            };
          }),
        },
      },
    }),
    {
      refreshDeps: [context.data, conf?.expertSystemURL],
    },
  );

  if (!width || !height || !conf) {
    return null;
  }
  if (loading) {
    return (
      <Box sx={{ position: 'relative', height }}>
        <LoadingOverlay visible />
      </Box>
    );
  }
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return (
      <Prism language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">
        {JSON.stringify(data.errors, null, 2)}
      </Prism>
    );
  }
  return (
    <Box>
      <Tabs defaultValue="0">
        <Tabs.List>
          {data.replies.map((r: any, i: number) => (
            <Tabs.Tab value={i.toString()}>{i}</Tabs.Tab>
          ))}
        </Tabs.List>
        {data.replies.map((r: any, i: number) => (
          <Tabs.Panel value={i.toString()} pt={6}>
            <Prism my={8} language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">
              {JSON.stringify(r, null, 2)}
            </Prism>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Box>
  );
}
