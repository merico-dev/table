import { Box } from '@mantine/core';
import { ILoginResp } from '../../api-caller/account.typed';
import { configureAPIClient } from '../../api-caller/request';
import { defaultStyles, IStyles } from '../styles';
import { LoginForm } from './form';
import { useApplyLanguage } from '../../i18n';

interface ILogin {
  lang: string;
  styles?: IStyles;
  config: ISettingsFormConfig;
  onSuccess: (resp: ILoginResp) => void;
}

export function Login({ lang, styles = defaultStyles, config, onSuccess }: ILogin) {
  configureAPIClient(config);
  useApplyLanguage(lang);

  return (
    <>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoginForm styles={styles} postSubmit={onSuccess} />
      </Box>
    </>
  );
}
