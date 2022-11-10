import { Box, LoadingOverlay } from '@mantine/core';
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
          quality: contextData.map(({ name, ...rest }) => ({
            actor: name,
            actor_type: 'project',
            ...rest,
          })),
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
      <Box sx={{ position: 'relative' }}>
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
  return <div>Merico Expert System. URL: {conf.expertSystemURL}</div>;
}
