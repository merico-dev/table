import { Group } from '@mantine/core';
import { IRegressionDescription, RegressionDescription } from './regression-description';
import { ISeriesSelector, SeriesSelector } from './series-selector';

export function Toolbox(props: IRegressionDescription & ISeriesSelector) {
  return (
    <Group position="apart" sx={{ height: '30px' }}>
      <RegressionDescription {...props} />
      <SeriesSelector {...props} />
    </Group>
  );
}
