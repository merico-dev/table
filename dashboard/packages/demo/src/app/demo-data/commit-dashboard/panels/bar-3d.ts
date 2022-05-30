export const bar3D = {
  id: 'bar-3d-demo',
  title: 'Effective Line Changes - ELOC',
  description: 'this is a demo for bar3D viz',
  layout: {
    x: 8,
    y: 6,
    w: 4,
    h: 28,
  },
  sql: `
  SELECT
      author_time,
      dev_equivalent,
      effective_add_line,
      effective_delete_line
  FROM public.commit_metric
  WHERE
      \$\{author_time_condition\}
      AND \$\{repo_id_condition\}
      AND \$\{author_email_condition\}
      AND dev_equivalent < 2000
      AND effective_add_line < 1000
      AND effective_delete_line < 1000
  ORDER BY dev_equivalent DESC
  LIMIT 1000
  `,
  viz: {
    type: 'bar-3d',
    conf: {
      x_axis_data_key: 'effective_add_line',
      y_axis_data_key: 'effective_delete_line',
      z_axis_data_key: 'dev_equivalent',
      xAxis3D: {
        type: 'value',
        name: 'Effective Added Lines',
      },
      yAxis3D: {
        type: 'value',
        name: 'Effective Deleted Lines',
      },
      zAxis3D: {
        type: 'value',
        name: 'ELOC',
      },
    },
  },
};
