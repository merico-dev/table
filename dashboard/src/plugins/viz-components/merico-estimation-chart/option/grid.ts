import { IMericoEstimationChartConf } from '../type';

export function getGrids(conf: IMericoEstimationChartConf, data: TVizData) {
  return [
    {
      top: 20,
      left: 30,
      right: 10,
      height: 40,
      containLabel: true,
      backgroundColor: 'rgba(235, 235, 255, 0.5)',
      borderWidth: 0,
      show: true,
    },
    {
      top: 70,
      left: 30,
      right: 10,
      height: 100,
      containLabel: true,
      backgroundColor: 'rgba(235, 235, 255, 0.5)',
      borderWidth: 0,
      show: true,
    },
    {
      top: 180,
      left: 30,
      right: 10,
      bottom: 110,
      containLabel: true,
      backgroundColor: 'rgba(235, 235, 255, 0.5)',
      borderWidth: 0,
      show: true,
    },
    {
      left: 30,
      right: 10,
      bottom: 0,
      height: 100,
      containLabel: true,
      backgroundColor: 'rgba(235, 235, 255, 0.5)',
      borderWidth: 0,
      show: true,
    },
  ];
}
