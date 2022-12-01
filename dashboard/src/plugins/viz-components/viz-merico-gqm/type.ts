export interface IMericoGQMConf {
  expertSystemURL: string;
  goal: string;
  question: string;
}

export const DEFAULT_CONFIG: IMericoGQMConf = {
  expertSystemURL: '',
  goal: '',
  question: '',
};
