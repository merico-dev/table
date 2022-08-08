import _ from 'lodash';
import React from 'react';
import { IRichTextConf } from './type';
import RichTextEditor from '@mantine/rte';

interface IRichText {
  conf: IRichTextConf;
  data: any[];
  width: number;
  height: number;
}

export function VizRichText({ conf, width, height }: IRichText) {
  if (!width || !height) {
    return null;
  }
  return <RichTextEditor readOnly value={conf.content} onChange={_.noop} sx={{ border: 'none' }} />;
}
