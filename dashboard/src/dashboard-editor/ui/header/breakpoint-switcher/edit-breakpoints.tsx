import { ActionIcon, Button, Group, NumberInput, Table, Text, TextInput, Tooltip } from '@mantine/core';
import { IconDeviceFloppy, IconPlus, IconRecycle, IconTrash } from '@tabler/icons-react';
import _, { isEqual } from 'lodash';
import { observer } from 'mobx-react-lite';
import { useMemo } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { v4 as uuidV4 } from 'uuid';
import { useEditContentModelContext } from '~/contexts';
import { LayoutSetInfo } from '~/model';

type LayoutSetFormInfo = Omit<LayoutSetInfo, 'breakpoint'> & { breakpoint: number | '' };
type Breakpoints = {
  list: LayoutSetFormInfo[];
};

export const EditBreakpoints = observer(({ done }: { done: () => void }) => {
  const { t } = useTranslation();
  const contentModel = useEditContentModelContext();
  const layouts = contentModel.layouts;

  const defaultValues = useMemo(() => ({ list: layouts.breakpointsInfo }), [layouts.breakpointsInfo]);
  const { control, handleSubmit, watch, getValues, reset, formState } = useForm<Breakpoints>({ defaultValues });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'list',
    rules: {
      validate: (values: LayoutSetFormInfo[]) => {
        if (_.uniqBy(values, 'breakpoint').length !== values.length) {
          return 'Screen sizes should be unique by min width';
        }
      },
    },
  });

  const watchFieldArray = watch('list');
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    };
  });

  const add = () => {
    append({
      id: uuidV4(),
      name: '',
      breakpoint: '',
    });
  };

  const submit = ({ list }: Breakpoints) => {
    const filtered = list.filter((b) => Number.isFinite(b.breakpoint)) as LayoutSetInfo[];
    layouts.updateLayoutSetsInfo(filtered);
    done();
  };

  const values = getValues();
  const changed = useMemo(() => {
    const validValues = { list: values.list.filter((l) => !!l.name && Number.isFinite(l.breakpoint)) };
    return !isEqual(validValues, defaultValues);
  }, [values, defaultValues]);

  const errorMessage = formState.errors.list?.root?.message;
  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <Table fz="sm" highlightOnHover withTableBorder sx={{ tableLayout: 'fixed' }}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th style={{ width: '340px' }}>{t('common.name')}</Table.Th>
              <Table.Th style={{ width: '160px' }}>{t('breakpoint.breakpoint')}</Table.Th>
              <Table.Th></Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {controlledFields.map((f, i) => (
              <Table.Tr key={f.id}>
                <Table.Th>
                  {f.id === 'basis' ? (
                    f.name
                  ) : (
                    <Controller
                      name={`list.${i}.name`}
                      control={control}
                      render={({ field }) => <TextInput size="xs" label="" required sx={{ flex: 1 }} {...field} />}
                    />
                  )}
                </Table.Th>
                <Table.Td>
                  {f.id === 'basis' ? (
                    <Text size="sm" ff="monospace">
                      {f.breakpoint}px
                    </Text>
                  ) : (
                    <Controller
                      name={`list.${i}.breakpoint`}
                      control={control}
                      render={({ field }) => (
                        <NumberInput
                          size="xs"
                          label=""
                          required
                          max={10000}
                          hideControls
                          rightSection={
                            <Text size="sm" c="dimmed">
                              px
                            </Text>
                          }
                          rightSectionProps={{ style: { width: '30px' } }}
                          sx={{ flex: 1 }}
                          ff="monospace"
                          styles={{ input: { paddingRight: '30px' } }}
                          {...field}
                        />
                      )}
                    />
                  )}
                </Table.Td>
                <Table.Td>
                  {f.id !== 'basis' && (
                    <ActionIcon mx="auto" size="xs" variant="subtle" color="red" onClick={() => remove(i)}>
                      <IconTrash />
                    </ActionIcon>
                  )}
                </Table.Td>
              </Table.Tr>
            ))}
            <Table.Tr style={{ backgroundColor: 'transparent' }}>
              <Table.Td colSpan={3} style={{ padding: '0' }}>
                <Tooltip label={t('breakpoint.add')}>
                  <ActionIcon variant="subtle" size="md" color="blue" onClick={add} sx={{ width: '100%' }}>
                    <IconPlus size={18} />
                  </ActionIcon>
                </Tooltip>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
        <Text mt={6} ta="right" size="xs" c="red">
          {errorMessage ?? '　'}
        </Text>
        <Group mt={6} justify="space-between">
          <Button
            color="orange"
            size="xs"
            onClick={() => reset()}
            leftSection={<IconRecycle size={18} />}
            disabled={!changed}
          >
            {t('common.actions.revert')}
          </Button>
          <Button
            color="green"
            size="xs"
            type="submit"
            leftSection={<IconDeviceFloppy size={18} />}
            disabled={!changed}
          >
            {t('common.actions.save_changes')}
          </Button>
        </Group>
      </form>
    </>
  );
});
