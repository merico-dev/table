import { ReactNode } from 'react';
import { ArrayPath, FieldArrayWithId, FieldValues, Path, PathValue } from 'react-hook-form';

export type ControlledField<T extends FieldValues> = FieldArrayWithId<T, ArrayPath<T>, 'id'> & PathValue<T, Path<T>>;
export type FieldArrayTabsChildren<FieldItem> = ({ field, index }: { field: FieldItem; index: number }) => ReactNode;
