import { Box, Button, Divider, Group, Modal, PasswordInput, Switch, TextInput } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconDeviceFloppy } from '@tabler/icons-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Edit } from 'tabler-icons-react';
import { APICaller } from '../api-caller';
import { IAccount } from '../api-caller/account.typed';
import { RoleSelector } from './role-selector';
import { IStyles, defaultStyles } from './styles';
import { SubmitFormButton } from '../components';
import { useTranslation } from 'react-i18next';

interface IFormValues {
  name: string;
  email: string;
  role_id: string;
  reset_password: boolean;
  new_password: string;
}

interface IEditAccountForm extends Pick<IAccount, 'id' | 'name' | 'email' | 'role_id'> {
  postSubmit: () => void;
  styles?: IStyles;
}

function EditAccountForm({ id, name, email, role_id, postSubmit, styles = defaultStyles }: IEditAccountForm) {
  const { t } = useTranslation();
  const { control, handleSubmit, watch } = useForm<IFormValues>({
    defaultValues: {
      name,
      email,
      role_id,
      reset_password: false,
      new_password: '',
    },
  });

  const update = async ({ name, email, role_id, reset_password, new_password }: IFormValues) => {
    try {
      showNotification({
        id: 'for-updating',
        title: t('common.state.pending'),
        message: t('account.state.updating'),
        loading: true,
        autoClose: false,
      });
      await APICaller.account.edit({
        id,
        name: name.trim(),
        email: email.trim(),
        role_id,
        reset_password,
        new_password: new_password.trim(),
      });
      updateNotification({
        id: 'for-updating',
        title: t('common.state.successful'),
        message: t('account.state.updated'),
        color: 'green',
        autoClose: true,
      });
      postSubmit();
    } catch (error: $TSFixMe) {
      updateNotification({
        id: 'for-updating',
        title: t('common.state.failed'),
        message: error.message,
        color: 'red',
        autoClose: true,
      });
    }
  };

  const [reset_password, new_password] = watch(['reset_password', 'new_password']);

  return (
    <Box mx="auto" mb={10}>
      <form onSubmit={handleSubmit(update)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextInput mb={styles.spacing} size={styles.size} required label={t('account.username')} {...field} />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextInput mb={styles.spacing} size={styles.size} required label={t('account.email')} {...field} />
          )}
        />

        <Controller
          name="role_id"
          control={control}
          render={({ field }) => <RoleSelector styles={styles} {...field} />}
        />

        <Divider my={20} variant="dashed" label="" labelPosition="center" />

        <Controller
          name="reset_password"
          control={control}
          render={({ field }) => (
            <Switch
              mb={styles.spacing}
              size={styles.size}
              label={t('account.reset_password')}
              checked={field.value}
              onChange={(event) => field.onChange(event.currentTarget.checked)}
              styles={{
                label: {
                  verticalAlign: 'middle',
                },
              }}
            />
          )}
        />

        {reset_password && (
          <Controller
            name="new_password"
            control={control}
            // rules={{
            //   validate: (v) => {
            //     return v.length >= 8 || 'At least 8 characters long';
            //   },
            // }}
            render={({ field }) => (
              <PasswordInput
                autoComplete="off"
                mb={styles.spacing}
                size={styles.size}
                required
                description={t('account.password_hint')}
                label={t('account.new_password')}
                {...field}
              />
            )}
          />
        )}

        <Group position="right" mt={styles.spacing}>
          <SubmitFormButton size={styles.button.size} />
        </Group>
      </form>
    </Box>
  );
}

interface IEditAccount {
  styles?: IStyles;
  onSuccess: () => void;
  account: IAccount;
}

export function EditAccount({ account, onSuccess, styles = defaultStyles }: IEditAccount) {
  const { t } = useTranslation();
  const [opened, setOpened] = React.useState(false);
  const open = () => setOpened(true);
  const close = () => setOpened(false);
  const postSubmit = () => {
    onSuccess();
    close();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t('account.editing_xx', { name: account.name })}
        trapFocus
        onDragStart={(e) => {
          e.stopPropagation();
        }}
      >
        <EditAccountForm {...account} postSubmit={postSubmit} styles={styles} />
      </Modal>
      <Button size={styles.button.size} onClick={open} leftIcon={<Edit size={20} />}>
        {t('common.actions.edit')}
      </Button>
    </>
  );
}
