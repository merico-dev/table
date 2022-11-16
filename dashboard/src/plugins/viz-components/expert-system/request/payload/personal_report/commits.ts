import { groupBy } from 'lodash';

export type TDataForCommits = {
  name?: string;
  actor: string;
  repos: number;
  range_days: number;
  ref_date: string;
  eloc: number;
};

export function personal_report_commits(data: TDataForCommits[]) {
  const commits: any[] = [];
  const grouped = groupBy(data, 'actor');
  Object.entries(grouped).forEach(([key, rows]) => {
    const { name, actor, repos, range_days } = rows[0];
    commits.push({
      actor: name ?? actor,
      actor_type: 'project',
      repos,
      range_days,
      data: rows.map(({ ref_date, eloc }) => ({
        ref_date,
        eloc: Number(eloc),
      })),
    });
  });
  return {
    commits,
  };
}
