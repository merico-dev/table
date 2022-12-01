// see TDataForQualityHistory
export default `
{
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
}
`;
