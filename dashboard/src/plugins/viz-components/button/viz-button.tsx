import { Button, Center } from '@mantine/core';
import { defaultsDeep, template } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { useModelContext } from '~/contexts';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IButtonConf } from './type';

export const VizButton = observer(({ context }: VizViewProps) => {
  const model = useModelContext();
  const { value: confValue } = useStorageData<IButtonConf>(context.instanceData, 'config');
  const conf: IButtonConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { content, ...mantineProps } = conf;

  const { width, height } = context.viewport;

  const params = {
    filters: model.filters.values,
    context: model.context.current,
  };
  return (
    <Center sx={{ width, height }}>
      <Button {...mantineProps}>{template(content)(params)}</Button>
    </Center>
  );
});
