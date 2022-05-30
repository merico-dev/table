export const lineBar = {
  id: 'line-demo',
  title: 'Lines Changed',
  description: 'this is a demo for line viz',
  layout: {
    x: 0,
    y: 29,
    w: 8,
    h: 24,
  },
  sql: `
  SELECT
      author_time:: DATE AS author_date,
      SUM(dev_equivalent) AS total_dev_eq,
      SUM(effective_add_line) AS total_effective_add_line,
      SUM(effective_delete_line) AS total_effective_delete_line,
      COUNT(id):: INT AS COUNT
  FROM public.commit_metric
  WHERE
      \$\{author_time_condition\}
      AND \$\{repo_id_condition\}
      AND \$\{author_email_condition\}
  GROUP BY author_date
  ORDER BY total_dev_eq DESC
  LIMIT 100
  `,
  viz: {
    type: 'line-bar',
    conf: {
      x_axis_data_key: 'author_date',
      legend: {},
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
      },
      yAxis: {},
      series: [
        {
          type: 'bar',
          name: 'Total Effective Delete Line',
          showSymbol: false,
          y_axis_data_key: 'total_effective_delete_line',
          stack: 'line_change',
          color: '#fa5252',
        },
        {
          type: 'bar',
          name: 'Total Effective Add Line',
          showSymbol: false,
          y_axis_data_key: 'total_effective_add_line',
          stack: 'line_change',
          color: '#40c057',
        },
        {
          type: 'line',
          name: 'Total ELOC',
          showSymbol: false,
          y_axis_data_key: 'total_dev_eq',
          color: '#25262b',
        },
      ],
    },
  },
};
