import { Box, Center } from '@mantine/core';
import React, { useMemo } from 'react';

import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { useStorageData } from '~/components/plugins/hooks';
import { useRenderContentModelContext } from '~/contexts';
import { VizViewProps } from '~/types/plugin';
import { templateToJSX } from '~/utils/template';
import { DEFAULT_CONFIG, IVizStatsConf } from './type';

const horizontalAlignments = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
};

const verticalAlignments = {
  top: 'flex-start',
  center: 'center',
  bottom: 'flex-end',
};

export const VizStats = observer(({ context }: VizViewProps) => {
  const contentModel = useRenderContentModelContext();
  const { value: conf = DEFAULT_CONFIG } = useStorageData<IVizStatsConf>(context.instanceData, 'config');
  const { variables } = context;
  const { template, horizontal_align, vertical_align } = conf;
  const { width, height } = context.viewport;

  const semiTemplate = useMemo(() => {
    try {
      return _.template(template)(contentModel.payloadForSQL);
    } catch (error) {
      return template;
    }
  }, [contentModel.payloadForSQL, template]);

  const contents = useMemo(() => {
    return templateToJSX(semiTemplate, variables, context.data);
  }, [semiTemplate, variables, context.data, context]);

  return (
    <Center
      sx={{
        width,
        height,
        justifyContent: horizontalAlignments[horizontal_align],
        alignItems: verticalAlignments[vertical_align],
      }}
    >
      <Box>
        {Object.values(contents).map((c, i) => (
          <React.Fragment key={i}>{c}</React.Fragment>
        ))}
      </Box>
    </Center>
  );
});
