import { CloseButton, ColorInput, TextInput } from '@mantine/core';
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
    <tr>
      <td>{index.toString()}</td>
      <td>
        <IntervalEditor form={form} index={index} />
      </td>
      <td>
        <Controller
          name={`visualMap.pieces.${index}.label`}
          control={control}
          render={({ field }) => (
            <TextInput size="xs" placeholder="" {...field} onChange={(e) => field.onChange(e.currentTarget.value)} />
          )}
        />
      </td>
      <td>
        <Controller
          name={`visualMap.pieces.${index}.color`}
          control={control}
          render={({ field }) => (
            <ColorInput
              label={t('')}
              placeholder={t('chart.color.label')}
              size="xs"
              withinPortal
              dropdownZIndex={340}
              rightSection={
                !!field.value ? (
                  <CloseButton
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
      </td>
      <td>
        <CloseButton onClick={() => remove(index)} />
      </td>
    </tr>
  );
};
