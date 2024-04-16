import { Box, Divider, Group, NumberInput, PasswordInput, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DataSourceType, TDataSourceConfig } from '../../../api-caller/datasource.typed';
import { SubmitFormButton } from '../../../components';
import { IStyles, defaultStyles } from '../../styles';

interface IFormValues {
  type: DataSourceType;
  key: string;
  config: TDataSourceConfig;
}

interface IAddDataSourceForm {
  submit: (values: IFormValues) => void;
  styles?: IStyles;
  type: 'postgresql' | 'mysql';
}

export function AddDataSourceForm_DB({ submit, styles = defaultStyles, type }: IAddDataSourceForm) {
  const { control, setValue, handleSubmit } = useForm<IFormValues>({
    defaultValues: {
      type,
      key: '',
      config: {
        host: '',
        port: 5432,
        username: '',
        password: '',
        database: '',
      },
    },
  });
  useEffect(() => {
    setValue('type', type);
  }, [setValue, type]);

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit(submit)}>
        <Controller
          name="key"
          control={control}
          render={({ field }) => (
            <TextInput
              mb={styles.spacing}
              size={styles.size}
              required
              label="Name"
              placeholder="A unique name"
              {...field}
            />
          )}
        />

        <Divider label="Connection Info" labelPosition="center" />

        <Group grow>
          <Controller
            name="config.host"
            control={control}
            render={({ field }) => (
              <TextInput mb={styles.spacing} size={styles.size} required label="Host" sx={{ flexGrow: 1 }} {...field} />
            )}
          />
          <Controller
            name="config.port"
            control={control}
            render={({ field }) => (
              // @ts-expect-error type of onChange
              <NumberInput
                mb={styles.spacing}
                size={styles.size}
                required
                label="Port"
                hideControls
                sx={{ width: '8em' }}
                {...field}
              />
            )}
          />
        </Group>

        <Controller
          name="config.username"
          control={control}
          render={({ field }) => (
            <TextInput mb={styles.spacing} size={styles.size} required label="Username" {...field} />
          )}
        />
        <Controller
          name="config.password"
          control={control}
          render={({ field }) => (
            <PasswordInput mb={styles.spacing} size={styles.size} required label="Password" {...field} />
          )}
        />
        <Controller
          name="config.database"
          control={control}
          render={({ field }) => (
            <TextInput mb={styles.spacing} size={styles.size} required label="Database" {...field} />
          )}
        />

        <Group position="right" mt={styles.spacing}>
          <SubmitFormButton size={styles.button.size} />
        </Group>
      </form>
    </Box>
  );
}
