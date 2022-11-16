import { groupBy } from 'lodash';

export type TDataForSkills = {
  actor: string;
  language: string;
  feature: string;
};

export function personal_report_skills(data: TDataForSkills[]) {
  const skills: any[] = [];
  const grouped = groupBy(data, 'actor');
  Object.entries(grouped).forEach(([key, rows]) => {
    const { actor } = rows[0];

    skills.push({
      actor,
      data: rows.map(({ language, feature }) => ({
        language,
        feature,
      })),
    });
  });
  return {
    skills,
  };
}
