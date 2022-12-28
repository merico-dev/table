export interface IMericoGQMConf {
  expertSystemURL: string;
  path: string;
  goal: string;
  question: string;
}

export const DEFAULT_CONFIG: IMericoGQMConf = {
  expertSystemURL: '',
  path: '',
  goal: '',
  question: '',
};
