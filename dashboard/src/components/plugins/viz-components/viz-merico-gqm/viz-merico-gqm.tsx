import { Box, Center, LoadingOverlay, Stack, Sx, Text } from '@mantine/core';
import { useRequest } from 'ahooks';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { CommonHTMLContentStyle } from '~/styles/common-html-content-style';
import { VizViewProps } from '~/types/plugin';
import { useStorageData } from '../../hooks';
import { MericoGQMErrorFigure } from './error-figure';
import { callExpertSystem } from './request/call-expert-system';
import { DEFAULT_CONFIG, IMericoGQMConf } from './type';

const BaseStyle: Sx = {
  height: '100%',
  overflowY: 'auto',
  ...CommonHTMLContentStyle,
};

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <Box sx={BaseStyle}>
      <div
        dangerouslySetInnerHTML={{ __html: message }}
        style={{ fontSize: '14px', lineHeight: '32px', color: '#3D3E45' }}
      />
    </Box>
  );
};

const GQMError = ({ error, width, height }: { error: { message: string }; width: number; height: number }) => {
  const msg = error.message;
  const inHTML = msg.startsWith('<');

  if (inHTML) {
    return <ErrorMessage message={msg} />;
  }

  // 25px is panel's title height, 20px is stack spacing, 30px for scrollbar
  const h = height - 25 - 20 - 30;
  return (
    <Center sx={{ width: '100%', height: h }}>
      <Stack align="center" spacing={20}>
        <MericoGQMErrorFigure />
        <ErrorMessage message={msg} />
      </Stack>
    </Center>
  );
};

export function VizMericoGQM({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<IMericoGQMConf>(context.instanceData, 'config');
  const conf: IMericoGQMConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { width, height } = context.viewport;
  const panelData = context.data;
  const { data, error, loading } = useRequest(callExpertSystem({ conf, panelData }), {
    refreshDeps: [panelData, conf],
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
      <Box sx={BaseStyle} data-enable-scrollbar>
        <GQMError error={error} width={width} height={height} />
      </Box>
    );
  }

  if (!data || !Array.isArray(data.replies) || data.replies.length === 0) {
    return null;
  }

  return (
    <Box sx={BaseStyle} data-enable-scrollbar>
      {data.replies.map((r, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: r.interpretation.html }} />
      ))}
    </Box>
  );
}
