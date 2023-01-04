import { Box, Center, LoadingOverlay, Stack, Text } from '@mantine/core';
import { useRequest } from 'ahooks';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { MericoGQMErrorFigure } from './error-figure';
import { callExpertSystem } from './request/call-expert-system';
import { DEFAULT_CONFIG, IMericoGQMConf } from './type';

const BaseStyle = { ul: { paddingLeft: '2em', margin: '6px 0 0' }, p: { margin: 0 } };

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
  if (error) {
    return (
      // 25px is panel's title height, 20px is stack spacing
      <Center sx={{ width, height: height - 25 - 20 }}>
        <Stack align="center" spacing={20}>
          <MericoGQMErrorFigure />
          <div
            dangerouslySetInnerHTML={{ __html: error.message }}
            style={{ fontSize: '14px', lineHeight: '32px', color: '#3D3E45' }}
          />
        </Stack>
      </Center>
    );
  }

  if (!data || !Array.isArray(data.replies) || data.replies.length === 0) {
    return null;
  }

  return (
    <Box sx={BaseStyle}>
      {data.replies.map((r, i) => (
        <div
          key={i}
          dangerouslySetInnerHTML={{ __html: r.interpretation.html }}
          style={{ fontSize: '14px', lineHeight: '32px', color: '#3D3E45' }}
        />
      ))}
    </Box>
  );
}
