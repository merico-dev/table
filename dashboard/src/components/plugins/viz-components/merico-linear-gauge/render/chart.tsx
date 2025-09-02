import { useMemo } from 'react';
import { IMericoLinearGaugeConf } from '../type';
import { getOption } from './option';
import { Center, Group, Text } from '@mantine/core';
import classes from './chart.module.css';

type Props = {
  conf: IMericoLinearGaugeConf;
  data: TPanelData;
  width: number;
  height: number;
};

export function Chart({ conf, data, width, height }: Props) {
  const option = useMemo(() => {
    return getOption(conf, data);
  }, [conf, data]);

  if (!width || !height) {
    return null;
  }

  return (
    <Group justify="flex-start" grow wrap="nowrap" gap={0} pt="sm" mah={height} w={width}>
      {option.sections.map((section) => (
        <Center key={section.name} className={classes.section} style={{ backgroundColor: section.color }}>
          <Text size="sm">{section.name}</Text>
          {section.min > 0 ? (
            <Text size="xs" className={classes.min}>
              {section.min}
            </Text>
          ) : null}
        </Center>
      ))}
    </Group>
  );
}
