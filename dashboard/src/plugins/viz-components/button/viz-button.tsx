import { Button, Center } from '@mantine/core';
import { defaultsDeep } from 'lodash';
import { useMemo } from 'react';
import { VizViewProps } from '../../../types/plugin';
import { useStorageData } from '../../hooks';
import { DEFAULT_CONFIG, IButtonConf } from './type';

export function VizButton({ context }: VizViewProps) {
  const { value: confValue } = useStorageData<IButtonConf>(context.instanceData, 'config');
  const conf: IButtonConf = useMemo(() => defaultsDeep({}, confValue, DEFAULT_CONFIG), [confValue]);

  const { content, ...mantineProps } = conf;

  const { width, height } = context.viewport;
  return (
    <Center sx={{ width, height }}>
      <Button {...mantineProps}>{content}</Button>
    </Center>
  );
}
