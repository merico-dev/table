export type TDataForQuality = {
  name?: string;
  actor: string;
  doc_coverage: number;
  test_coverage: number;
  dryness: number;
  modularity: number;
  issues_density: number;

  issues_blocker: number;
  issues_critical: number;
  issues_info: number;
  issues_major: number;
  issues_minor: number;
};

export function performance_quality(data: TDataForQuality[]) {
  return {
    quality: data.map(
      ({ name, actor, issues_blocker, issues_critical, issues_info, issues_major, issues_minor, ...rest }) => {
        return {
          actor: name ?? actor,
          actor_type: 'project',
          code: {
            ...rest,
            issues: {
              blocker: issues_blocker,
              critical: issues_critical,
              info: issues_info,
              major: issues_major,
              minor: issues_minor,
            },
          },
        };
      },
    ),
  };
}
