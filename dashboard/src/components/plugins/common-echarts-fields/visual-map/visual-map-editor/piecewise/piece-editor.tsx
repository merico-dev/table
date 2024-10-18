import { CloseButton, ColorInput, Table, TextInput } from '@mantine/core';
import { Control, Controller, UseFormReturn, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { VisualMapPartialForm } from '../types';
import { IntervalEditor } from './interval-editor';

type Props = {
  form: UseFormReturn<VisualMapPartialForm>;
  index: number;
  remove: (index: number) => void;
};
export const PieceEditor = ({ form, index, remove }: Props) => {
  const { control } = form;
  const { t } = useTranslation();
  return (
    <Table.Tr>
      <Table.Td>{(index + 1).toString()}</Table.Td>
      <Table.Td>
        <IntervalEditor form={form} index={index} />
      </Table.Td>
      <Table.Td>
        <Controller
          name={`visualMap.pieces.${index}.label`}
          control={control}
          render={({ field }) => (
            <TextInput size="xs" placeholder="" {...field} onChange={(e) => field.onChange(e.currentTarget.value)} />
          )}
        />
      </Table.Td>
      <Table.Td>
        <Controller
          name={`visualMap.pieces.${index}.color`}
          control={control}
          render={({ field }) => (
            <ColorInput
              label={t('')}
              placeholder={t('chart.color.label')}
              size="xs"
              popoverProps={{
                withinPortal: true,
                zIndex: 340,
              }}
              rightSection={
                !!field.value ? (
                  <CloseButton
                    size="sm"
                    onClick={() => {
                      field.onChange('');
                    }}
                  />
                ) : null
              }
              {...field}
            />
          )}
        />
      </Table.Td>
      <Table.Td>
        <CloseButton size="sm" onClick={() => remove(index)} />
      </Table.Td>
    </Table.Tr>
  );
};
