export type TDataForQuality = {
  name?: string;
  actor?: string;
  doc_coverage: number;
  test_coverage: number;
  dryness: number;
  modularity: number;
  issues?: {
    blocker: number;
    critical: number;
    info: number;
    major: number;
    minor: number;
  };
  issues_density: number;
};

export function performance_quality(data: TDataForQuality[]) {
  return {
    quality: data.map(({ name, actor, ...rest }) => {
      return {
        actor: name ?? actor,
        actor_type: 'project',
        code: {
          ...rest,
        },
      };
    }),
  };
}
