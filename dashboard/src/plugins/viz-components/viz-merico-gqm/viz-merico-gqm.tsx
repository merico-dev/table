import { Box, LoadingOverlay, Tabs, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { useRequest } from 'ahooks';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { callExpertSystem } from './request/call-expert-system';
import { DEFAULT_CONFIG, IMericoGQMConf } from './type';

export function VizMericoGQM({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<IMericoGQMConf>(context.instanceData, 'config');
  const conf: IMericoGQMConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { width, height } = context.viewport;
  const contextData = (context.data as $TSFixMe[]) ?? [];
  const { data, error, loading } = useRequest(callExpertSystem({ conf, data: contextData }), {
    refreshDeps: [JSON.stringify(contextData), conf?.expertSystemURL],
  });

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

  if (!data || !Array.isArray(data.replies) || data.replies.length === 0) {
    return null;
  }

  return (
    <Box>
      {data.replies.map((r, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: r.interpretation.html }} />
      ))}
    </Box>
  );
}
