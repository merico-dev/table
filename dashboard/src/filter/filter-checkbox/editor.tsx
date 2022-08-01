import { Checkbox } from "@mantine/core";
import { Control, Controller, FieldArrayWithId } from "react-hook-form";
import { IFilterSettingsForm } from "../filter-settings/types";

interface IFilterEditorCheckbox {
  field: FieldArrayWithId<IFilterSettingsForm, "filters", "id">;
  index: number;
  control: Control<IFilterSettingsForm, object>;
}

export function FilterEditorCheckbox({ field, index, control }: IFilterEditorCheckbox) {
  return (
    <>
      <Controller
        name={`filters.${index}.config.default_value`}
        control={control}
        render={({ field }) => (
          // @ts-expect-error
          <Checkbox checked={field.value} onChange={e => field.onChange(e.currentTarget.checked)} label="Default Checked"/>
        )}
      />
    </>
  )
}