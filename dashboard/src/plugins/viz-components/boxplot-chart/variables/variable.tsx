/**
 * NOTE: this file is almost a duplicate of stats/panel/variable.tsx
 * FIXME: remove this when variables' fields are defined in utils/template
 */
import { ActionIcon, Stack } from '@mantine/core';
import { Control, Controller, UseFieldArrayRemove } from 'react-hook-form';
import { Trash } from 'tabler-icons-react';
import { TemplateVariableField } from '~/utils/template';
import { IBoxplotChartConf } from '../type';

interface VariableField {
  control: Control<IBoxplotChartConf, $TSFixMe>;
  index: number;
  remove: UseFieldArrayRemove;
  data: $TSFixMe[];
}

export function VariableField({ control, index, remove, data }: VariableField) {
  return (
    <Stack
      key={index}
      my="sm"
      p={0}
      sx={{ border: '1px solid #eee', borderTopColor: '#333', borderTopWidth: 2, position: 'relative' }}
    >
      <Controller
        name={`variables.${index}`}
        control={control}
        render={({ field }) => <TemplateVariableField data={data} withStyle={false} {...field} />}
      />
      <ActionIcon
        color="red"
        variant="subtle"
        onClick={() => remove(index)}
        sx={{ position: 'absolute', top: 15, right: 5 }}
      >
        <Trash size={16} />
      </ActionIcon>
    </Stack>
  );
}
