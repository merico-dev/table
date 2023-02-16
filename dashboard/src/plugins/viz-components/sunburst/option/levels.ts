import { ISunburstConf } from '../type';

interface ILabelFormatter {
  treePathInfo: {
    name: string;
    dataIndex: number;
    value: number;
  }[];
  name: string;
  value: number;
}

const getLabelFormatter =
  (tolerance: number) =>
  ({ treePathInfo, name, value }: ILabelFormatter) => {
    if (treePathInfo.length === 1 || !tolerance) {
      return name;
    }
    try {
      const p = treePathInfo[treePathInfo.length - 2].value;
      if (value / p < tolerance) {
        return ' ';
      }
    } catch (error) {
      return name;
    }
  };

export function getLevels(conf: ISunburstConf) {
  const { levels } = conf;

  return levels.map((l) => {
    const { show_label_tolerance, ...label } = l.label;
    return {
      ...l,
      label: {
        ...label,
        formatter: getLabelFormatter(show_label_tolerance),
      },
    };
  });
}
