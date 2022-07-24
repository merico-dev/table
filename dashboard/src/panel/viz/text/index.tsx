import { Text } from '@mantine/core';
import numbro from 'numbro';
import _ from "lodash";

function interpolateString(template: string, params: Record<string, any> = {}) {
  const extendedParams = { ...params, numbro }
  const names = Object.keys(extendedParams);
  const vals = Object.values(extendedParams);
  try {
    return new Function(...names, `return \`${template}\`;`)(...vals);
  } catch (error: any) {
    return error.message;
  }
}

interface IVizText {
  conf: any;
  data: any;
  width: number;
  height: number;
}

export function VizText({ conf: { paragraphs }, data }: IVizText) {
  return (
    <>
      {paragraphs.map(({ template, size, ...rest }: any, index: number) => (
        <Text key={`${template}---${index}`} {...rest} sx={{ fontSize: size }}>{interpolateString(template, data[0])}</Text>
      ))}
    </>
  )
}