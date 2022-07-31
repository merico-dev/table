import { Control, FieldArrayWithId } from "react-hook-form";
import { IFilterSettingsForm } from "./types";

interface IFilterSetting {
  field: FieldArrayWithId<IFilterSettingsForm, "filters", "id">;
  index: number;
  control: Control<IFilterSettingsForm, object>;
}

export function FilterSetting({ field }: IFilterSetting) {
  return (
    <span>{field.key}</span>
  )
}