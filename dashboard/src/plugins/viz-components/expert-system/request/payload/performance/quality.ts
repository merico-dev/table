export function performance_quality(data: any[]) {
  return {
    quality: data.map(({ name, ...rest }) => {
      return {
        actor: name,
        actor_type: 'project',
        code: {
          ...rest,
        },
      };
    }),
  };
}
