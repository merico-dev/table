import { Alert, Box, Button, List, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ReactNode, forwardRef } from 'react';
import { AnyObject } from '~/types';
import { InlineFunctionInput } from '../inline-function-input';

interface Props {
  title: string;
  value: TFunctionString;
  onChange: (v: TFunctionString) => void;
  defaultValue: TFunctionString;
  label: string;
  description?: ReactNode;
  triggerLabel?: string;
  triggerButtonProps?: AnyObject;
}

export const ModalFunctionEditor = forwardRef(
  (
    {
      title,
      value,
      onChange,
      label,
      description = null,
      triggerLabel = 'Edit',
      triggerButtonProps = {},
      defaultValue,
    }: Props,
    _ref: any,
  ) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
      <>
        <Modal opened={opened} onClose={close} title={title} withinPortal zIndex={320} size="900px">
          {description}
          <Box h={600}>
            <InlineFunctionInput value={value} onChange={onChange} defaultValue={defaultValue} label={label} />
          </Box>
        </Modal>

        <Button onClick={open} {...triggerButtonProps}>
          {triggerLabel}
        </Button>
      </>
    );
  },
);
