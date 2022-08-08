import { ActionIcon, Group, Text, ColorInput, useMantineTheme } from '@mantine/core';
import _ from 'lodash';
import React from 'react';
import { DeviceFloppy, PlaylistAdd, Trash } from 'tabler-icons-react';

interface IColorArrayInput {
  label: React.ReactNode;
  value: string[];
  onChange: (value: string[]) => void;
}

function _ColorArrayInput({ label, value, onChange }: IColorArrayInput, ref: any) {
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
    return Object.entries(theme.colors).map(([_color, profile]) => profile[6]);
  }, [theme]);

  return (
    <>
      <Group position="left" ref={ref}>
        <Text>{label}</Text>
        <ActionIcon mr={5} variant="filled" color="blue" disabled={!changed} onClick={submit}>
          <DeviceFloppy size={20} />
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
                <Trash size={14} />
              </ActionIcon>
            }
            sx={{ width: '45%' }}
          />
        ))}
        <ActionIcon onClick={add} color="blue" variant="outline">
          <PlaylistAdd size={20} />
        </ActionIcon>
      </Group>
    </>
  );
}

export const ColorArrayInput = React.forwardRef(_ColorArrayInput);
