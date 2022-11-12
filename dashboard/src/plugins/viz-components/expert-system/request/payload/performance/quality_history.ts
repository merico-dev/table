import { groupBy } from 'lodash';

export type TDataForQualityHistory = {
  name?: string;
  actor: string;
  val_type:
    | 'doc_coverage'
    | 'test_coverage'
    | 'dryness'
    | 'modularity'
    | 'blocker_issues'
    | 'critical_issues'
    | 'major_issues'
    | 'minor_issues'
    | 'info_issues'
    | 'issues_density';
  baseline_lower: number;
  baseline_upper: number;
  ref_date: string;
  val: number;
};

export function performance_quality_history(data: TDataForQualityHistory[]) {
  const quality_history: any[] = [];
  const grouped = groupBy(data, ({ actor, val_type }) => `${actor}-${val_type}`);
  Object.entries(grouped).forEach(([key, rows]) => {
    const { name, actor, val_type, baseline_lower, baseline_upper } = rows[0];
    quality_history.push({
      actor: name ?? actor,
      actor_type: 'project',
      val_type,
      baseline: [baseline_lower, baseline_upper],
      data: rows.map((r) => ({
        ref_date: r.ref_date,
        val: r.val,
      })),
    });
  });
  return {
    quality_history,
  };
}
