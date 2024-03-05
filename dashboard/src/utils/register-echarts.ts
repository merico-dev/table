import {
  BarChart,
  BoxplotChart,
  FunnelChart,
  HeatmapChart,
  LineChart,
  PieChart,
  RadarChart,
  ScatterChart,
  SunburstChart,
} from 'echarts/charts';
import {
  CalendarComponent,
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';

export function registerECharts() {
  use([
    CanvasRenderer,

    BarChart,
    BoxplotChart,
    FunnelChart,
    HeatmapChart,
    LineChart,
    PieChart,
    RadarChart,
    ScatterChart,
    SunburstChart,

    CalendarComponent,
    DataZoomComponent,
    GridComponent,
    LegendComponent,
    TooltipComponent,
    MarkLineComponent,
    MarkAreaComponent,
    VisualMapComponent,
  ]);
}
