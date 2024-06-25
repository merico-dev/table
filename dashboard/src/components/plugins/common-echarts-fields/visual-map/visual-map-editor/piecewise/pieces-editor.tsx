import { Button, Stack, Table } from '@mantine/core';
import { IconPlaylistAdd } from '@tabler/icons-react';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getVisualMapPiece } from '../../utils';
import { VisualMapPartialForm } from '../types';
import { PieceEditor } from './piece-editor';

type Props = {
  form: UseFormReturn<VisualMapPartialForm>;
};

export const PiecesEditor = ({ form }: Props) => {
  const { t, i18n } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'visualMap.pieces',
  });

  const watchFieldArray = form.watch('visualMap.pieces');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });
  const add = () => {
    append(getVisualMapPiece());
  };
  return (
    <Stack>
      <Table>
        <thead>
          <tr>
            <th style={{ width: '40px' }} />
            <th>Interval</th>
            <th>Label</th>
            <th>Color</th>
            <th style={{ width: '40px' }} />
          </tr>
        </thead>
        <tbody>
          {controlledFields.map((field, index) => (
            <PieceEditor key={field.id} index={index} form={form} remove={remove} />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td />
            <td colSpan={3}>
              <Button
                mt={10}
                size="xs"
                color="blue"
                leftIcon={<IconPlaylistAdd size={20} />}
                onClick={add}
                sx={{ width: '50%' }}
                mx="auto"
              >
                {t('chart.visual_map.piecewise.add_a_piece')}
              </Button>
            </td>
            <td />
          </tr>
        </tfoot>
      </Table>
    </Stack>
  );
};
