import { IEchartsReferenceArea } from './types';

function getAxisValue(key: string, variableValueMap: Record<string, string | number>) {
  if (!key) {
    return undefined;
  }
  return variableValueMap[key] ?? undefined;
}

interface IProps {
  reference_areas: IEchartsReferenceArea[];
  variableValueMap: Record<string, string | number>;
}
export function getReferenceAreasSeries({ reference_areas, variableValueMap }: IProps) {
  const markAreaData = reference_areas.map((r) => {
    return [
      {
        name: r.content.text,
        value: r.content.text,
        itemStyle: r.itemStyle,
        label: r.label,
        xAxis: getAxisValue(r.leftTopPoint.x_data_key, variableValueMap),
        yAxis: getAxisValue(r.leftTopPoint.y_data_key, variableValueMap),
      },
      {
        xAxis: getAxisValue(r.rightBottomPoint.x_data_key, variableValueMap),
        yAxis: getAxisValue(r.rightBottomPoint.y_data_key, variableValueMap),
      },
    ];
  });

  return {
    type: 'scatter',
    name: 'ref_areas',
    silent: true,
    data: [],
    markArea: {
      data: markAreaData,
    },
  };
}
