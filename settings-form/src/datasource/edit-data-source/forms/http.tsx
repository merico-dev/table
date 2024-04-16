import { Box, Button, Divider, Group, TextInput } from '@mantine/core';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { Controller, useForm } from 'react-hook-form';
import { DataSourceType, TDataSourceConfig_HTTP } from '../../../api-caller/datasource.typed';
import { FunctionStringField } from '../../components/function-string-field';
import { IStyles, defaultStyles } from '../../styles';
import { SubmitFormButton } from '../../../components';
import { useTranslation } from 'react-i18next';

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

interface IEditDataSourceForm {
  name: string;
  config: TDataSourceConfig_HTTP;
  submit: (values: IFormValues) => void;
  styles?: IStyles;
}

export function EditDataSourceForm_HTTP({ name, config, submit, styles = defaultStyles }: IEditDataSourceForm) {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<IFormValues>({
    defaultValues: {
      config,
    },
  });

  return (
    <Box mx="auto">
      <form onSubmit={handleSubmit(submit)}>
        <TextInput mb={styles.spacing} size={styles.size} required label={t('common.name')} value={name} readOnly />

        <Divider label={t('datasource.connection_info')} labelPosition="center" />

        <Controller
          name="config.host"
          control={control}
          render={({ field }) => (
            <TextInput
              mb={styles.spacing}
              size={styles.size}
              label={t('datasource.http.base_url')}
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
                label={t('datasource.http.processing.pre.label')}
                modalTitle={t('datasource.http.processing.pre.description')}
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
                label={t('datasource.http.processing.post.label')}
                modalTitle={t('datasource.http.processing.post.description')}
                defaultValue={DEFAULT_HTTP_PROCESSING.post}
                {...field}
                styles={styles}
              />
            )}
          />
        </Group>

        <Group position="right" mt={styles.spacing}>
          <SubmitFormButton size={styles.button.size} />
        </Group>
      </form>
    </Box>
  );
}
