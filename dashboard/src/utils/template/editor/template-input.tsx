import { TextInput, TextInputProps } from '@mantine/core';
import { ChangeEventHandler, forwardRef } from 'react';

interface ITemplateInput extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const TemplateInput = forwardRef(function TemplateInput({ value, onChange, ...rest }: ITemplateInput, ref: any) {
  return <TextInput ref={ref} value={value} onChange={onChange} {...rest} />;
});
