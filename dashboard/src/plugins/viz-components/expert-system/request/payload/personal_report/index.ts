import { EMetricSet, IExpertSystemConf } from '../../../type';
import { personal_report_quality, TDataForPersonalReportQuality } from './quality';
import { personal_report_commits, TDataForCommits } from './commits';
import { personal_report_skills, TDataForSkills } from './skills';

export type TPersonalReportData = $TSFixMe | TDataForSkills[] | TDataForPersonalReportQuality[] | TDataForCommits[];

function getContent(conf: IExpertSystemConf, data: TPersonalReportData) {
  switch (conf.metric_set) {
    case EMetricSet.skills:
      return personal_report_skills(data as TDataForSkills[]);
    case EMetricSet.quality:
      return personal_report_quality(data as TDataForPersonalReportQuality[]);
    case EMetricSet.commits:
      return personal_report_commits(data as TDataForCommits[]);
    default:
      throw new Error('Invalid metric_set for scenario[personal_report]');
  }
}

export function buildPayloadForPersonalReport(conf: IExpertSystemConf, data: TPersonalReportData) {
  return {
    personal_report: {
      ...getContent(conf, data),
    },
  };
}
