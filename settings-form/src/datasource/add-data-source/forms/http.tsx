import { Box, Button, Divider, Group, TextInput } from '@mantine/core';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { DataSourceType, TDataSourceConfig_HTTP } from '../../../api-caller/datasource.typed';
import { defaultStyles, IStyles } from '../../styles';
import { FunctionStringField } from '../../components/function-string-field';

export const DEFAULT_HTTP_PROCESSING = {
  pre: [
    'function pre_process({ method, url, params, headers, data }, utils) {',
    '    // your code goes here',
    '    return { method, url, params, headers, data }',
    '}',
  ].join('\n'),
  post: ['function post_process(res, utils) {', '    // your code goes here', '    return data', '}'].join('\n'),
};

interface IFormValues {
  type: DataSourceType;
  key: string;
  config: TDataSourceConfig_HTTP;
}

interface IAddDataSourceForm {
  submit: (values: IFormValues) => void;
  styles?: IStyles;
}

export function AddDataSourceForm_HTTP({ submit, styles = defaultStyles }: IAddDataSourceForm) {
  const { control, setValue, handleSubmit } = useForm<IFormValues>({
    defaultValues: {
      type: 'http',
      key: '',
      config: {
        host: '',
        processing: {
          pre: DEFAULT_HTTP_PROCESSING.pre,
          post: DEFAULT_HTTP_PROCESSING.post,
        },
      },
    },
  });

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

        <Controller
          name="config.host"
          control={control}
          render={({ field }) => (
            <TextInput
              mb={styles.spacing}
              size={styles.size}
              required
              label="Base URL"
              sx={{ flexGrow: 1 }}
              {...field}
            />
          )}
        />
        <Group grow>
          <Controller
            name="config.processing.pre"
            control={control}
            render={({ field }) => (
              <FunctionStringField
                label="Pre Processing"
                modalTitle="This function will run before sending the request (for scenarios like encryption)"
                defaultValue={DEFAULT_HTTP_PROCESSING.pre}
                {...field}
                styles={styles}
              />
            )}
          />
          <Controller
            name="config.processing.post"
            control={control}
            render={({ field }) => (
              <FunctionStringField
                label="Post Processing"
                modalTitle="This function will run after sending the request (for scenarios like decryption)"
                defaultValue={DEFAULT_HTTP_PROCESSING.post}
                {...field}
                styles={styles}
              />
            )}
          />
        </Group>

        <Group position="right" mt={styles.spacing}>
          <Button type="submit" size={styles.button.size}>
            Save
          </Button>
        </Group>
      </form>
    </Box>
  );
}
