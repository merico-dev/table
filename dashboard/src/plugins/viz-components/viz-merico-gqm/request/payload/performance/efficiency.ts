import { groupBy } from 'lodash';

export type TDataForEfficiency = {
  name?: string;
  actor: string;
  eloc_type: 'accumulated' | 'new';
  ref_date: string;
  eloc: number;
};

export function performance_efficiency(data: TDataForEfficiency[]) {
  const efficiency: any[] = [];
  const grouped = groupBy(data, ({ actor, eloc_type }) => `${actor}-${eloc_type}`);
  Object.entries(grouped).forEach(([key, rows]) => {
    const { name, actor, eloc_type } = rows[0];
    efficiency.push({
      actor: name ?? actor,
      actor_type: 'project',
      eloc_type,
      data: rows.map(({ ref_date, eloc }) => ({
        ref_date,
        eloc,
      })),
    });
  });
  return {
    efficiency,
  };
}
