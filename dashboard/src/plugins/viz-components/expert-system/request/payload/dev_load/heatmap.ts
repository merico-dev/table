import { groupBy } from 'lodash';

export type TDataForHeatmap = {
  name?: string;
  actor: string;
  ref_date: string;
  eloc: number;
};

export function dev_load_heatmap(data: TDataForHeatmap[]) {
  const heatmap: any[] = [];
  const grouped = groupBy(data, 'actor');
  Object.entries(grouped).forEach(([key, rows]) => {
    const { name, actor } = rows[0];
    heatmap.push({
      actor: name ?? actor,
      actor_type: 'project',
      data: rows.map((r) => ({
        ref_date: r.ref_date,
        eloc: r.eloc,
      })),
    });
  });
  return {
    heatmap,
  };
}
