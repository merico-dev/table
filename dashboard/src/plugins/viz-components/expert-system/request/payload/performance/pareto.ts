import { groupBy } from 'lodash';

export type TDataForPareto = {
  name?: string;
  actor: string;
  contributor: string;
  eloc: number;
};

export function performance_pareto(data: TDataForPareto[]) {
  const pareto: any[] = [];
  const grouped = groupBy(data, 'actor');
  Object.entries(grouped).forEach(([key, rows]) => {
    const { name, actor } = rows[0];
    pareto.push({
      actor: name ?? actor,
      actor_type: 'project',
      data: rows.map(({ contributor, eloc }) => ({
        contributor,
        eloc: Number(eloc),
      })),
    });
  });
  return {
    pareto,
  };
}
