import { Box, Button, Group, PasswordInput, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { Controller, useForm } from 'react-hook-form';
import { APICaller } from '../../api-caller';
import { ILoginResp } from '../../api-caller/account.typed';
import { defaultStyles, IStyles } from '../styles';

interface IFormValues {
  name: string;
  password: string;
}

interface ILoginForm {
  postSubmit: (resp: ILoginResp) => void;
  styles?: IStyles;
}

export function LoginForm({ postSubmit, styles = defaultStyles }: ILoginForm) {
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
        title: 'Pending',
        message: 'Loggin in...',
        loading: true,
      });
      const res = await APICaller.account.login(name, password);
      window.localStorage.setItem('token', res.token);
      updateNotification({
        id: 'for-login',
        title: 'Successful',
        message: 'Logged in',
        color: 'green',
      });
      postSubmit(res);
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-login',
        title: 'Login Failed',
        message: error.message,
        color: 'red',
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
            <TextInput mb={styles.spacing} size={styles.size} required label="Username" {...field} />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput mb={styles.spacing} size={styles.size} required label="Password" {...field} />
          )}
        />
        <Group position="right" mt={styles.spacing}>
          <Button type="submit" size={styles.button.size}>
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
}
