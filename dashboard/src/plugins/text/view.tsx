import { Text } from '@mantine/core';
import { isArray } from 'lodash';
import numbro from 'numbro';
import * as React from 'react';
import { VizViewProps } from '../../types/plugin';
import { useStorageData } from '../hooks/use-storage-data';
import { CONF, ITextViewProps } from './types';

function interpolateString(template: string, params: Record<string, any> = {}) {
  const extendedParams = { ...params, numbro };
  const names = Object.keys(extendedParams);
  const valList = Object.values(extendedParams);
  try {
    return new Function(...names, `return \`${template}\`;`)(...valList);
  } catch (error: any) {
    return error.message;
  }
}

export const TextView = ({ context }: VizViewProps) => {
  const {
    value
  } = useStorageData<ITextViewProps>(context.instanceData, CONF);
  const { data } = context;
  if (!value || !isArray(data)) {
    return null;
  }
  const { paragraphs } = value;
  return <>
    {paragraphs.map(({ template, size, ...rest }: any, index: number) => (
      <Text key={`${template}---${index}`} {...rest}
            sx={{ fontSize: size }}>{interpolateString(template, data[0])}</Text>
    ))}
  </>;
};
