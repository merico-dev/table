import { Checkbox, TextInput } from "@mantine/core";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";
import { IFilterSettingsForm } from "../filter-settings/types";

interface IFilterEditorTextInput {
  field: FieldArrayWithId<IFilterSettingsForm, "filters", "id">;
  index: number;
  control: Control<IFilterSettingsForm, object>;
}

export function FilterEditorTextInput({ field, index, control }: IFilterEditorTextInput) {
  return (
    <Controller
      name={`filters.${index}.config.required`}
      control={control}
      render={({ field }) => (
        <Checkbox checked={field.value} onChange={e => field.onChange(e.currentTarget.checked)} label="Required"/>
      )}
    />
  )
}