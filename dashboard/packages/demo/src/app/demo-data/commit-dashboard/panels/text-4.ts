export const text4 = {
  id: 'text-demo-4',
  title: '🏆 Most Effective Line Deleted',
  description: '',
  layout: {
    x: 9,
    y: 0,
    w: 3,
    h: 6,
  },
  sql: `
SELECT
  author_email,
  SUM(effective_delete_line)::int AS effective_delete_line
FROM public.commit_metric
WHERE
  \$\{author_time_condition\}
  AND \$\{repo_id_condition\}
  AND \$\{author_email_condition\}
GROUP BY author_email
ORDER BY effective_delete_line desc
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
          template: '${effective_delete_line} lines',
        },
      ],
    },
  },
};
