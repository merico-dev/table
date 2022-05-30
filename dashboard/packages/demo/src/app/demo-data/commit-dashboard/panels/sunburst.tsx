export const sunburst = {
  id: 'sunburst-demo',
  title: 'Contribution Sunbrust',
  description: 'this is a demo for sunburst viz',
  layout: {
    x: 8,
    y: 35,
    w: 4,
    h: 24,
  },
  sql: `
    SELECT
      author_email AS name,
      SUM(dev_equivalent) AS VALUE
    FROM public.commit_metric
    WHERE
      \$\{author_time_condition\}
      AND \$\{repo_id_condition\}
      AND \$\{author_email_condition\}
    GROUP BY author_email
    ORDER BY VALUE desc
    LIMIT 100
  `,
  viz: {
    type: 'sunburst',
    conf: {},
  },
};
