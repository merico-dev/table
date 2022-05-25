const text1 = {
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
          template: '${author_email}'
        },
        {
          align: 'center',
          size: 'md',
          weight: 'bold',
          color: 'red',
          template: '${total_dev_eq}'
        },
      ],
    },
  }
};

const text2 = {
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
      ]
    },
  }
};

const text3 = {
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
      ]
    },
  }
};

const text4 = {
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
      ]
    },
  }
};

const table = {
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
      "id_field": "author_email",
      "use_raw_columns": false,
      "columns": [
        {
          "label": "Email",
          "value_field": "author_email",
          "value_type": "string"
        },
        {
          "label": "ELOC",
          "value_field": "total_dev_eq",
          "value_type": "eloc"
        },
        {
          "label": "ShareLOC",
          "value_field": "total_share_loc",
          "value_type": "percentage"
        },
        {
          "label": "Lines Added",
          "value_field": "total_effective_add_line",
          "value_type": "number"
        },
        {
          "label": "Lines Deleted",
          "value_field": "total_effective_delete_line",
          "value_type": "number"
        },
        {
          "label": "Commits",
          "value_field": "count",
          "value_type": "number"
        },
        {
          "label": "Punished Commits",
          "value_field": "punished_count",
          "value_type": "number"
        }
      ],
      "size": "xs",
      "horizontalSpacing": "sm",
      "verticalSpacing": "xs",
      "striped": true,
      "highlightOnHover": true
    },
  }
};

const bar3D = {
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
    }
  }
};

const sunburst = {
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
  }
};

const line = {
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
        trigger: 'axis'
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
          color: '#fa5252'
        },
        {
          type: 'bar',
          name: 'Total Effective Add Line',
          showSymbol: false,
          y_axis_data_key: 'total_effective_add_line',
          stack: 'line_change',
          color: '#40c057'
        },
        {
          type: 'line',
          name: 'Total ELOC',
          showSymbol: false,
          y_axis_data_key: 'total_dev_eq',
          color: '#25262b'
        },
      ]
    },
  }
};

export const DEMO_PANELS = [
  text1,
  text2,
  text3,
  text4,
  table,
  bar3D,
  sunburst,
  line,
]