export const text2 = {
  id: 'text-demo-2',
  title: '🏆 Most Commits',
  description: '',
  layout: {
    x: 3,
    y: 0,
    w: 3,
    h: 6,
  },
  sql: `
SELECT
  author_email,
  COUNT(id)::int AS count
FROM public.commit_metric
WHERE
  \$\{author_time_condition\}
  AND \$\{repo_id_condition\}
  AND \$\{author_email_condition\}
GROUP BY author_email
ORDER BY count desc
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
          template: '${count} commits',
        },
      ],
    },
  },
};
