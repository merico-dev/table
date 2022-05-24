import { Text } from '@mantine/core';
import _ from "lodash";

function interpolateString(template: string, params: Record<string, any> = {}) {
  const names = Object.keys(params);
  const vals = Object.values(params);
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
      {paragraphs.map(({ template, ...rest }: any, index: number) => (
        <Text key={`${template}---${index}`} {...rest}>{interpolateString(template, data[0])}</Text>
      ))}
    </>
  )
}