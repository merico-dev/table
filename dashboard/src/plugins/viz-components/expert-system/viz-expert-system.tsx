import { Box, LoadingOverlay, Tabs, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useRequest } from 'ahooks';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { callExpertSystem } from './request/call-expert-system';
import { buildPayload } from './request/payload';
import { DEFAULT_CONFIG, IExpertSystemConf } from './type';

export function VizExpertSystem({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<IExpertSystemConf>(context.instanceData, 'config');
  const conf: IExpertSystemConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { width, height } = context.viewport;
  const contextData = (context.data as $TSFixMe[]) ?? [];
  const {
    data = {},
    error,
    loading,
  } = useRequest(
    callExpertSystem({
      baseURL: conf?.expertSystemURL,
      payload: buildPayload(conf, contextData),
    }),
    {
      refreshDeps: [JSON.stringify(contextData), conf?.expertSystemURL],
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
      <Text color="red">Response for debugging:</Text>
      <Tabs defaultValue="0">
        <Tabs.List>
          {data.replies?.map((r: any, i: number) => (
            <Tabs.Tab key={`${r.actor}-${r.metric}-${i}`} value={i.toString()}>
              {i}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {data.replies?.map((r: any, i: number) => (
          <Tabs.Panel key={`${r.actor}-${r.metric}-${i}`} value={i.toString()} pt={6}>
            <Prism my={8} language="json" sx={{ width: '100%' }} noCopy colorScheme="dark">
              {JSON.stringify(r, null, 2)}
            </Prism>
          </Tabs.Panel>
        ))}
      </Tabs>
    </Box>
  );
}
