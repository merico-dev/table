import { groupBy } from 'lodash';

export type TDataForPersonalReportQuality = {
  name?: string;
  actor: string;
  code_issue_density: number;
  code_test_coverage: number;
  code_doc_coverage: number;
  baseline_issue_density: number;
  baseline_test_coverage: number;
  baseline_doc_coverage: number;
};

export function personal_report_quality(data: TDataForPersonalReportQuality[]) {
  const quality: any[] = [];
  const grouped = groupBy(data, 'actor');
  Object.entries(grouped).forEach(([key, rows]) => {
    const {
      name,
      actor,
      code_issue_density,
      code_test_coverage,
      code_doc_coverage,
      baseline_issue_density,
      baseline_test_coverage,
      baseline_doc_coverage,
    } = rows[0];
    quality.push({
      actor: name ?? actor,
      code: {
        issues_density: code_issue_density,
        test_coverage: code_test_coverage,
        doc_coverage: code_doc_coverage,
      },
      baseline: {
        issues_density: baseline_issue_density,
        test_coverage: baseline_test_coverage,
        doc_coverage: baseline_doc_coverage,
      },
    });
  });
  return {
    quality,
  };
}
