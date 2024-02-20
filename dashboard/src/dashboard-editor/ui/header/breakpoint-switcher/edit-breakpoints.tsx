import { ActionIcon, Button, Divider, Group, NumberInput, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { IconDeviceFloppy, IconPlaylistAdd, IconPlus, IconTrash } from '@tabler/icons-react';
import { v4 as uuidV4 } from 'uuid';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useEditContentModelContext } from '~/contexts';
import { isEqual } from 'lodash';

type Breakpoints = {
  list: { id: string; name: string; breakpoint: number | '' }[];
};

export const EditBreakpoints = observer(() => {
  const contentModel = useEditContentModelContext();
  const layouts = contentModel.layouts;

  const defaultValues = useMemo(() => ({ list: layouts.breakpointsInfo }), [layouts.breakpointsInfo]);
  const { control, handleSubmit, watch, getValues, reset } = useForm<Breakpoints>({ defaultValues });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'list',
  });

  const watchFieldArray = watch('list');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const add = () =>
    append({
      id: uuidV4(),
      name: '',
      breakpoint: '',
    });

  const values = getValues();
  const changed = useMemo(() => {
    return !isEqual(values, defaultValues);
  }, [values, defaultValues]);

  return (
    <>
      <form onSubmit={handleSubmit(console.log)}>
        <Table fontSize="sm" highlightOnHover withBorder sx={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '340px' }}>Name</th>
              <th style={{ width: '160px' }}>Min Width</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {controlledFields.map((f, i) => (
              <tr key={f.id}>
                <th>
                  {f.id === 'basis' ? (
                    'basis'
                  ) : (
                    <Controller
                      name={`list.${i}.name`}
                      control={control}
                      render={({ field }) => <TextInput size="xs" label="" required sx={{ flex: 1 }} {...field} />}
                    />
                  )}
                </th>
                <td>
                  {f.id === 'basis' ? (
                    <Text ff="monospace">{f.breakpoint}px</Text>
                  ) : (
                    <Controller
                      name={`list.${i}.breakpoint`}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          size="xs"
                          label=""
                          required
                          hideControls
                          rightSection={<Text color="dimmed">px</Text>}
                          rightSectionProps={{ style: { width: '30px' } }}
                          sx={{ flex: 1, fontFamily: 'monospace' }}
                          styles={{ input: { paddingRight: '30px' } }}
                          {...field}
                        />
                      )}
                    />
                  )}
                </td>
                <td>
                  {f.id !== 'basis' && (
                    <ActionIcon mx="auto" size="xs" variant="subtle" color="red" onClick={() => remove(i)}>
                      <IconTrash />
                    </ActionIcon>
                  )}
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: 'transparent' }}>
              <td colSpan={3} style={{ padding: '0' }}>
                <Tooltip label="Add a screen size">
                  <ActionIcon variant="subtle" size="md" color="blue" onClick={add} sx={{ width: '100%' }}>
                    <IconPlus size={18} />
                  </ActionIcon>
                </Tooltip>
              </td>
            </tr>
          </tbody>
        </Table>
        <Group mt={20} position="right">
          <Button color="green" size="xs" type="submit" leftIcon={<IconDeviceFloppy size={18} />} disabled={!changed}>
            Save changes
          </Button>
        </Group>
      </form>
    </>
  );
});
