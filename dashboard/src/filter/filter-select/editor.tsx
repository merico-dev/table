import { ActionIcon, Button, Divider, Group, Select, Text, TextInput } from "@mantine/core";
import { Control, Controller, FieldArrayWithId, useFieldArray, UseFormWatch } from "react-hook-form";
import { PlaylistAdd, Trash } from "tabler-icons-react";
import { FilterQueryField } from "../filter-query-field";
import { IFilterSettingsForm } from "../filter-settings/types";

interface IFilterEditorSelect {
  field: FieldArrayWithId<IFilterSettingsForm, "filters", "id">;
  index: number;
  control: Control<IFilterSettingsForm, object>;
  watch: UseFormWatch<IFilterSettingsForm>;
}

export function FilterEditorSelect({ field, index, control, watch }: IFilterEditorSelect) {
  const { fields: staticOptionFields, append, remove } = useFieldArray({
    control,
    name: `filters.${index}.config.static_options`,
  })

  const watchedStaticOptions = watch(`filters.${index}.config.static_options`)

  const addStaticOption = () => {
    append({
      label: '',
      value: '',
    })
  }

  const optionsForDefaultValue = [
    { label: 'No default selection', value: '' },
    ...watchedStaticOptions,
  ]
  return (
    <>
      <Divider label="Configure options" labelPosition="center" />
      {staticOptionFields.length > 0 && (
        <Controller
          name={`filters.${index}.config.default_value`}
          control={control}
          render={({ field }) => (
            // @ts-expect-error
            <Select label="Default Selection" data={optionsForDefaultValue} {...field} />
          )}
        />
      )}
      {staticOptionFields.map((_optionField, optionIndex) => (
        <Group sx={{ position: 'relative' }} pr="40px" >
          <Controller
            name={`filters.${index}.config.static_options.${optionIndex}.label`}
            control={control}
            render={({ field }) => (
              <TextInput label="Label" required {...field} sx={{ flexGrow: 1 }} />
            )}
          />
          <Controller
            name={`filters.${index}.config.static_options.${optionIndex}.value`}
            control={control}
            render={({ field }) => (
              <TextInput label="Value" required {...field} sx={{ flexGrow: 1 }} />
            )}
          />
          <ActionIcon
            color="red" variant="subtle"
            onClick={() => remove(optionIndex)}
            sx={{ position: 'absolute', top: 28, right: 5 }}
          >
            <Trash size={16} />
          </ActionIcon>
        </Group>
      ))}
      <Button size="xs" color="blue" leftIcon={<PlaylistAdd size={20} />} onClick={addStaticOption} sx={{ width: '50%' }} mx="auto" >Add an Option</Button>
      <Divider label="Or fetch options from database" labelPosition="center" />
      <Controller
        name={`filters.${index}.config.options_query`}
        control={control}
        render={({ field }) => (
          <FilterQueryField {...field} />
        )}
      />
    </>
  )
}