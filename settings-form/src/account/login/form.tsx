import { Box, Button, Group, PasswordInput, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Controller, useForm } from 'react-hook-form';
import { APICaller } from '../../api-caller';
import { ILoginResp } from '../../api-caller/account.typed';
import { defaultStyles, IStyles } from '../styles';
import { SubmitFormButton } from '../../components';
import { useTranslation } from 'react-i18next';

interface IFormValues {
  name: string;
  password: string;
}

interface ILoginForm {
  postSubmit: (resp: ILoginResp) => void;
  styles?: IStyles;
}

export function LoginForm({ postSubmit, styles = defaultStyles }: ILoginForm) {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<IFormValues>({
    defaultValues: {
      name: '',
      password: '',
    },
  });

  const login = async ({ name, password }: IFormValues) => {
    try {
      showNotification({
        id: 'for-login',
        title: t('common.state.pending'),
        message: t('account.state.logging_in'),
        loading: true,
        autoClose: false,
      });
      const res = await APICaller.account.login(name.trim(), password.trim());
      window.localStorage.setItem('token', res.token);
      updateNotification({
        id: 'for-login',
        title: t('common.state.successful'),
        message: t('account.state.logged_in'),
        color: 'green',
        autoClose: true,
      });
      postSubmit(res);
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-login',
        title: t('common.state.failed'),
        message: error.message,
        color: 'red',
        autoClose: true,
      });
    }
  };

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit(login)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput mb={styles.spacing} size={styles.size} required label={t('account.username')} {...field} />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput mb={styles.spacing} size={styles.size} required label={t('account.password')} {...field} />
          )}
        />
        <Group position="right" mt={styles.spacing}>
          <SubmitFormButton size={styles.button.size} />
        </Group>
      </form>
    </Box>
  );
}
