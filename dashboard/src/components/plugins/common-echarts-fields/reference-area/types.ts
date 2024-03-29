import { IEchartsLabelPosition } from '../label-position';

export interface IEchartsReferenceArea {
  id: string;
  content: {
    text: string;
  };
  itemStyle: {
    color: string;
  };
  label: {
    position: IEchartsLabelPosition;
    color: string;
  };
  leftBottomPoint: {
    x_data_key: string;
    y_data_key: string;
  };
  rightTopPoint: {
    x_data_key: string;
    y_data_key: string;
  };
  xAxisIndex: string;
  yAxisIndex: string;
}

export function getNewReferenceArea(): IEchartsReferenceArea {
  const id = new Date().getTime().toString();
  return {
    id,
    content: {
      text: id,
    },
    itemStyle: {
      color: 'rgba(0,0,0,0.05)',
    },
    label: {
      position: 'inside',
      color: 'rgba(0,0,0,0.5)',
    },
    leftBottomPoint: {
      x_data_key: '',
      y_data_key: '',
    },
    rightTopPoint: {
      x_data_key: '',
      y_data_key: '',
    },
    xAxisIndex: '0',
    yAxisIndex: '0',
  };
}
