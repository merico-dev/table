import { ICartesianReferenceArea } from '../../type';

export function getReferenceAreas(
  reference_areas: ICartesianReferenceArea[],
  variableValueMap: Record<string, string | number>,
) {
  return reference_areas.map((r) => ({
    name: '',
    type: 'line',
    hide_in_legend: true,
    data: [],
    markArea: {
      itemStyle: {
        color: r.color,
      },
      data: [
        [
          {
            yAxis: variableValueMap[r.y_keys.upper],
          },
          {
            yAxis: variableValueMap[r.y_keys.lower],
          },
        ],
      ],
      silent: true,
    },
  }));
}
