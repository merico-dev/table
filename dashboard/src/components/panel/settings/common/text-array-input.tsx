import { ActionIcon, Group, Text, TextInput } from '@mantine/core';
import { IconDeviceFloppy, IconPlaylistAdd, IconTrash } from '@tabler/icons-react';
import _ from 'lodash';
import React from 'react';

interface ITextArrayInput {
  label: React.ReactNode;
  value: string[] | number[];
  onChange: (value: string[] | number[]) => void;
  /**
   * @default 'text'
   */
  type?: 'text' | 'number';
}

function _TextArrayInput({ label, value, onChange, type }: ITextArrayInput, ref: $TSFixMe) {
  const [values, setValues] = React.useState(Array.isArray(value) ? [...value] : []);

  const add = React.useCallback(() => {
    setValues((s) => [...s, '']);
  }, [setValues]);

  const del = React.useCallback(
    (index: number) => {
      setValues((s) => {
        s.splice(index, 1);
        return [...s];
      });
    },
    [setValues],
  );

  const changed = React.useMemo(() => {
    return !_.isEqual(values.map(String), value.map(String));
  }, [values, value]);

  const submit = () => {
    onChange(
      values.map((s) => {
        if (type === 'number') {
          return Number(s);
        }
        return s.toString();
      }) as string[] | number[],
    );
  };

  return (
    <>
      <Group justify="flex-start" ref={ref}>
        <Text>{label}</Text>
        <ActionIcon mr={5} variant="filled" color="blue" disabled={!changed} onClick={submit}>
          <IconDeviceFloppy size={20} />
        </ActionIcon>
      </Group>
      <Group>
        {values.map((v, i) => (
          <TextInput
            type={type}
            value={v}
            onChange={(event: React.FormEvent<HTMLInputElement>) => {
              const newValue = event.currentTarget.value;
              setValues((s) => {
                s.splice(i, 1, newValue);
                return [...s];
              });
            }}
            rightSection={
              <ActionIcon onClick={() => del(i)} color="red" variant="subtle">
                <IconTrash size={14} />
              </ActionIcon>
            }
            sx={{ width: '45%' }}
          />
        ))}
        <ActionIcon onClick={add} color="blue" variant="outline">
          <IconPlaylistAdd size={20} />
        </ActionIcon>
      </Group>
    </>
  );
}
export const TextArrayInput = React.forwardRef(_TextArrayInput);
