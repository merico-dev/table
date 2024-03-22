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
        console.log({ values });
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
        <Table fontSize="sm" highlightOnHover withBorder sx={{ tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: '340px' }}>{t('common.name')}</th>
              <th style={{ width: '160px' }}>{t('breakpoint.breakpoint')}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {controlledFields.map((f, i) => (
              <tr key={f.id}>
                <th>
                  {f.id === 'basis' ? (
                    f.name
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
                          max={10000}
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
                <Tooltip label={t('breakpoint.add')}>
                  <ActionIcon variant="subtle" size="md" color="blue" onClick={add} sx={{ width: '100%' }}>
                    <IconPlus size={18} />
                  </ActionIcon>
                </Tooltip>
              </td>
            </tr>
          </tbody>
        </Table>
        <Text mt={6} ta="right" size="xs" color="red">
          {errorMessage ?? '　'}
        </Text>
        <Group mt={6} position="apart">
          <Button
            color="orange"
            size="xs"
            onClick={() => reset()}
            leftIcon={<IconRecycle size={18} />}
            disabled={!changed}
          >
            {t('common.actions.revert')}
          </Button>
          <Button color="green" size="xs" type="submit" leftIcon={<IconDeviceFloppy size={18} />} disabled={!changed}>
            {t('common.actions.save_changes')}
          </Button>
        </Group>
      </form>
    </>
  );
});
