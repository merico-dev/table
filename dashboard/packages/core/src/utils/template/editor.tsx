import { Text, TextInput, TextInputProps } from "@mantine/core";
import _ from "lodash";
import React, { ChangeEventHandler } from "react";

interface ITemplateInput extends Omit<TextInputProps, 'value' | 'onChange'> {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const TemplateInput = React.forwardRef(function TemplateInput({ value, onChange, ...rest }: ITemplateInput, ref: any) {
  return (
    <TextInput
      ref={ref}
      value={value}
      onChange={onChange}
      {...rest}
    />
  )
})

