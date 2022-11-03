import { Box } from '@mantine/core';
import { APIClient } from '../../api-caller/request';
import { LoginForm } from './form';
import { defaultStyles, IStyles } from '../styles';
import { ILoginResp } from '../../api-caller/account.typed';

interface ILogin {
  styles?: IStyles;
  config: ISettingsFormConfig;
  onSuccess: (resp: ILoginResp) => void;
}

export function Login({ styles = defaultStyles, config, onSuccess }: ILogin) {
  if (APIClient.baseURL !== config.apiBaseURL) {
    APIClient.baseURL = config.apiBaseURL;
  }

  return (
    <>
      <Box mt={styles.spacing} sx={{ position: 'relative' }}>
        <LoginForm styles={styles} postSubmit={onSuccess} />
      </Box>
    </>
  );
}
