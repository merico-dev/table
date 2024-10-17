import { ActionIcon, ColorInput, Group, Text, useMantineTheme } from '@mantine/core';
import { IconDeviceFloppy, IconPlaylistAdd, IconTrash } from '@tabler/icons-react';
import _ from 'lodash';
import React from 'react';

interface IColorArrayInput {
  label: React.ReactNode;
  value: string[];
  onChange: (value: string[]) => void;
}

function _ColorArrayInput({ label, value, onChange }: IColorArrayInput, ref: $TSFixMe) {
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
    return !_.isEqual(values, value);
  }, [values, value]);

  const submit = () => {
    onChange(values.map((s) => s.toString()));
  };

  const theme = useMantineTheme();

  const swatches = React.useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return Object.entries(theme.colors).map(([color, profile]) => profile[6]);
  }, [theme]);

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
          <ColorInput
            value={v}
            onChange={(color: string) => {
              setValues((s) => {
                s.splice(i, 1, color);
                return [...s];
              });
            }}
            swatches={swatches}
            rightSection={
              <ActionIcon onClick={() => del(i)} color="red">
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

export const ColorArrayInput = React.forwardRef(_ColorArrayInput);
