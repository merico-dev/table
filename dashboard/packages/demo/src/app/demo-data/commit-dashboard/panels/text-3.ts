export const text3 = {
  id: 'text-demo-3',
  title: '🏆 Most Effective Line Added',
  description: '',
  layout: {
    x: 6,
    y: 0,
    w: 3,
    h: 6,
  },
  sql: `
SELECT
  author_email,
  SUM(effective_add_line)::int AS effective_add_line
FROM public.commit_metric
WHERE
  \$\{author_time_condition\}
  AND \$\{repo_id_condition\}
  AND \$\{author_email_condition\}
GROUP BY author_email
ORDER BY effective_add_line desc
LIMIT 1
  `,
  viz: {
    type: 'text',
    conf: {
      paragraphs: [
        {
          align: 'center',
          size: 'xl',
          weight: 'bold',
          template: '${author_email}',
        },
        {
          align: 'center',
          size: 'md',
          weight: 'bold',
          color: 'red',
          template: '${effective_add_line} lines',
        },
      ],
    },
  },
};
