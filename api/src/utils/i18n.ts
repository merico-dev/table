import { I18n } from 'i18n';
import path from 'path';
import { DEFAULT_LANGUAGE } from './constants';

export default new I18n({
  locales: [DEFAULT_LANGUAGE, 'zh'],
  directory: path.join(__dirname, '../locales'),
  defaultLocale: DEFAULT_LANGUAGE
});