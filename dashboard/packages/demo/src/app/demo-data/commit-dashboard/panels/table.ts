export const table = {
  id: 'table-demo',
  title: 'Top 10 Contributors',
  description: 'this is a demo for table viz',
  layout: {
    x: 0,
    y: 6,
    w: 8,
    h: 28,
  },
  sql: `
SELECT
  author_email,
  SUM(dev_equivalent) AS total_dev_eq,
  SUM(share_loc) AS total_share_loc,
  SUM(effective_add_line) AS total_effective_add_line,
  SUM(effective_delete_line) AS total_effective_delete_line,
  COUNT(id):: INT AS COUNT,
  COUNT(CASE
    WHEN is_punished
    THEN 1END
  ) AS punished_count
FROM public.commit_metric
WHERE
      \$\{author_time_condition\}
      AND \$\{repo_id_condition\}
      AND \$\{author_email_condition\}
GROUP BY author_email
ORDER BY total_dev_eq desc
LIMIT 10
  `,
  viz: {
    type: 'table',
    conf: {
      id_field: 'author_email',
      use_raw_columns: false,
      columns: [
        {
          label: 'Email',
          value_field: 'author_email',
          value_type: 'string',
        },
        {
          label: 'ELOC',
          value_field: 'total_dev_eq',
          value_type: 'eloc',
        },
        {
          label: 'ShareLOC',
          value_field: 'total_share_loc',
          value_type: 'percentage',
        },
        {
          label: 'Lines Added',
          value_field: 'total_effective_add_line',
          value_type: 'number',
        },
        {
          label: 'Lines Deleted',
          value_field: 'total_effective_delete_line',
          value_type: 'number',
        },
        {
          label: 'Commits',
          value_field: 'count',
          value_type: 'number',
        },
        {
          label: 'Punished Commits',
          value_field: 'punished_count',
          value_type: 'number',
        },
      ],
      size: 'xs',
      horizontalSpacing: 'sm',
      verticalSpacing: 'xs',
      striped: true,
      highlightOnHover: true,
    },
  },
};
