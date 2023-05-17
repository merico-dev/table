import React, { useMemo } from 'react';
import { Text } from '@mantine/core';

import { VizViewProps } from '~/types/plugin';
import { templateToJSX } from '~/utils/template';
import { useStorageData } from '~/plugins/hooks';
import { DEFAULT_CONFIG, IVizStatsConf } from './type';
import { observer } from 'mobx-react-lite';
import { useContentModelContext } from '~/contexts';
import _ from 'lodash';

export const VizStats = observer(({ context }: VizViewProps) => {
  const contentModel = useContentModelContext();
  const { value: conf = DEFAULT_CONFIG } = useStorageData<IVizStatsConf>(context.instanceData, 'config');
  const { variables } = context;
  const { template, align } = conf;

  const semiTemplate = useMemo(() => {
    try {
      const params = {
        filters: contentModel.payloadForSQL.filterValues,
        context: contentModel.payloadForSQL.context,
      };
      return _.template(template)(params);
    } catch (error) {
      return template;
    }
  }, [contentModel.payloadForSQL, template]);

  const contents = useMemo(() => {
    return templateToJSX(semiTemplate, variables, context.data as Record<string, number>[]);
  }, [semiTemplate, variables, context.data, context]);

  return (
    <Text align={align}>
      {Object.values(contents).map((c, i) => (
        <React.Fragment key={i}>{c}</React.Fragment>
      ))}
    </Text>
  );
});
