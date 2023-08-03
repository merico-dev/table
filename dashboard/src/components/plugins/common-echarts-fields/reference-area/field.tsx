import { Divider, Group, Select, Stack, Text, TextInput } from '@mantine/core';
import _ from 'lodash';
import { forwardRef } from 'react';
import { MantineColorSelector } from '~/components/panel/settings/common/mantine-color';
import { LabelPositionSelector } from '../label-position';
import { IEchartsReferenceArea } from './types';

type SelectorOptionType = { label: string; value: string; description?: string };

interface IReferenceAreaField {
  value: IEchartsReferenceArea;
  onChange: (v: IEchartsReferenceArea) => void;
  variableOptions: SelectorOptionType[];
  xAxisOptions?: SelectorOptionType[];
  yAxisOptions?: SelectorOptionType[];
}

export const ReferenceAreaField = forwardRef(
  ({ value, onChange, xAxisOptions, yAxisOptions, variableOptions }: IReferenceAreaField, ref: any) => {
    const handleChange = (path: string, v: any) => {
      const newValue = _.cloneDeep(value);
      _.set(newValue, path, v);
      onChange(newValue);
    };
    return (
      <Stack>
        <Divider mb={-15} variant="dashed" label="Content" labelPosition="right" />
        <Group grow noWrap>
          <TextInput
            label="Content Text"
            value={value.content.text}
            onChange={(e) => handleChange('content.text', e.currentTarget.value)}
          />
          <LabelPositionSelector
            label="Text Position"
            value={value.label.position}
            onChange={(v) => handleChange('label.position', v)}
          />
        </Group>

        <Divider mb={-15} variant="dashed" label="Endpoints" labelPosition="right" />
        <Group grow noWrap>
          {xAxisOptions && (
            <Select
              label="X Axis"
              data={xAxisOptions}
              value={value.xAxisIndex}
              onChange={(v) => handleChange('xAxisIndex', v)}
            />
          )}
          {yAxisOptions && (
            <Select
              label="Y Axis"
              data={yAxisOptions}
              value={value.yAxisIndex}
              onChange={(v) => handleChange('xAxisIndex', v)}
            />
          )}
        </Group>
        <Stack spacing={0}>
          <Text size={14} color="#212529" fw={500}>
            Left-Bottom Point
          </Text>
          <Group grow noWrap>
            <Select
              icon={<Text>x</Text>}
              data={variableOptions}
              value={value.leftBottomPoint.x_data_key}
              onChange={(v) => handleChange('leftBottomPoint.x_data_key', v ?? '')}
              clearable
            />
            <Select
              icon={<Text>y</Text>}
              data={variableOptions}
              value={value.leftBottomPoint.y_data_key}
              onChange={(v) => handleChange('leftBottomPoint.y_data_key', v ?? '')}
              clearable
            />
          </Group>
        </Stack>
        <Stack spacing={0}>
          <Text size={14} color="#212529" fw={500}>
            Right-Top Point
          </Text>
          <Group grow noWrap>
            <Select
              icon={<Text>x</Text>}
              data={variableOptions}
              value={value.rightTopPoint.x_data_key}
              onChange={(v) => handleChange('rightTopPoint.x_data_key', v ?? '')}
              clearable
            />
            <Select
              icon={<Text>y</Text>}
              data={variableOptions}
              value={value.rightTopPoint.y_data_key}
              onChange={(v) => handleChange('rightTopPoint.y_data_key', v ?? '')}
              clearable
            />
          </Group>
        </Stack>

        <Divider mb={-15} variant="dashed" label="Style" labelPosition="right" />
        <Stack spacing={4}>
          <Text size={14}>Background Color</Text>
          <MantineColorSelector value={value.itemStyle.color} onChange={(v) => handleChange('itemStyle.color', v)} />
        </Stack>
        <Stack spacing={4}>
          <Text size={14}>Text Color</Text>
          <MantineColorSelector value={value.label.color} onChange={(v) => handleChange('label.color', v)} />
        </Stack>
      </Stack>
    );
  },
);
