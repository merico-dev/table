import { groupBy } from 'lodash';

export type TDataForProductivity = {
  name?: string;
  actor: string;
  ref_date: string;
  baseline: number;
  eloc: number;
  eloc_type: 'current' | 'previous';
};

type DataType = Pick<TDataForProductivity, 'eloc' | 'ref_date'>;

export function dev_load_productivity(data: TDataForProductivity[]) {
  const productivity: any[] = [];
  const grouped = groupBy(data, 'actor');
  Object.entries(grouped).forEach(([key, rows]) => {
    const { name, actor, baseline } = rows[0];
    const current: DataType[] = [];
    const previous: DataType[] = [];

    rows.forEach(({ ref_date, eloc, eloc_type }) => {
      const item = {
        ref_date,
        eloc,
      };
      if (eloc_type === 'current') {
        current.push(item);
      } else if (eloc_type === 'previous') {
        previous.push(item);
      } else {
        console.error('Invalid eloc_type for dev_load.productivity');
      }
    });

    productivity.push({
      actor: name ?? actor,
      actor_type: 'project',
      baseline,
      current,
      previous,
    });
  });
  return {
    productivity,
  };
}
