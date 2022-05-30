export const text1 = {
  id: 'text-demo-1',
  title: '🏆 Most ELOC',
  description: '',
  layout: {
    x: 0,
    y: 0,
    w: 3,
    h: 6,
  },
  sql: `
SELECT
  author_email,
  SUM(dev_equivalent) AS total_dev_eq
FROM public.commit_metric
WHERE
  \$\{author_time_condition\}
  AND \$\{repo_id_condition\}
  AND \$\{author_email_condition\}
GROUP BY author_email
ORDER BY total_dev_eq desc
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
          color: 'black',
          template: '${author_email}',
        },
        {
          align: 'center',
          size: 'md',
          weight: 'bold',
          color: 'red',
          template: '${total_dev_eq}',
        },
      ],
    },
  },
};
